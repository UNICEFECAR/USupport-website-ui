import { createServer } from "http";
import { readFile as fsReadFile, writeFile, mkdir, rm } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, "..", "dist");
const localesDir = path.resolve(__dirname, "..", "src", "locales");

// All languages supported
const languages = ["en", "pl", "uk", "ru", "kk", "hy", "ro", "ar", "tr", "el"];

// Routes to prerender (without language prefix)
const routes = [
  "",
  "how-it-works",
  "about-us",
  "information-portal",
  "my-qa",
  "privacy-policy",
  "sos-center",
  "cookie-policy",
  "terms-of-use",
  "organizations",
];

// MIME types for serving files
const mimeTypes = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".ico": "image/x-icon",
};

// Cache for locale data
const localeCache = {};

async function getLocaleData(lang) {
  if (localeCache[lang]) {
    return localeCache[lang];
  }

  try {
    const localePath = path.join(localesDir, `${lang}.json`);
    const localeRaw = await fsReadFile(localePath, "utf8");
    const localeJson = JSON.parse(localeRaw);
    localeCache[lang] = {
      description: localeJson.meta?.description || "",
      title: localeJson.meta?.title || "uSupport",
    };
  } catch (err) {
    localeCache[lang] = { description: "", title: "uSupport" };
  }

  return localeCache[lang];
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Generate all route combinations
function generateAllRoutes() {
  const allRoutes = [];
  for (const lang of languages) {
    for (const route of routes) {
      const fullRoute = route ? `/${lang}/${route}` : `/${lang}`;
      allRoutes.push({ route: fullRoute, lang });
    }
  }
  return allRoutes;
}

async function startPreviewServer(port = 4173) {
  console.log("🚀 Starting SPA preview server...");

  const server = createServer(async (req, res) => {
    let urlPath = req.url.split("?")[0]; // Remove query string

    // Handle base path /website/
    if (urlPath.startsWith("/website/")) {
      urlPath = urlPath.slice(8); // Remove /website prefix
    } else if (urlPath === "/website") {
      urlPath = "/";
    }

    // Try to serve the file directly
    let filePath = path.join(distDir, urlPath);

    // If it's a directory, try index.html
    if (existsSync(filePath) && !path.extname(filePath)) {
      filePath = path.join(filePath, "index.html");
    }

    // If file doesn't exist, serve the main index.html (SPA fallback)
    if (!existsSync(filePath)) {
      filePath = path.join(distDir, "index.html");
    }

    try {
      const content = await fsReadFile(filePath);
      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || "application/octet-stream";

      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    } catch (err) {
      res.writeHead(404);
      res.end("Not found");
    }
  });

  return new Promise((resolve, reject) => {
    server.listen(port, () => {
      console.log(`✅ Preview server started at http://localhost:${port}`);
      resolve(server);
    });

    server.on("error", reject);
  });
}

async function updateHtmlMeta(html, lang) {
  const localeData = await getLocaleData(lang);

  // Update lang attribute
  html = html.replace(/(<html[^>]*)\slang="[^"]*"/, `$1 lang="${lang}"`);

  // Update meta description
  if (localeData.description) {
    html = html.replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${escapeHtml(localeData.description)}" />`
    );
  }

  // Update title
  if (localeData.title) {
    html = html.replace(
      /<title>[^<]*<\/title>/,
      `<title>${escapeHtml(localeData.title)}</title>`
    );
  }

  return html;
}

async function prerenderRoute(browser, routeInfo, baseUrl) {
  const { route, lang } = routeInfo;
  const page = await browser.newPage();
  const url = `${baseUrl}/website${route}`;

  try {
    console.log(`📄 Prerendering: ${route}`);

    // Set a realistic viewport
    await page.setViewport({ width: 1280, height: 800 });

    // Navigate to the page and wait for network to be idle
    const response = await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    if (!response || !response.ok()) {
      throw new Error(`HTTP ${response?.status()} for ${url}`);
    }

    // Wait for the root element to have content
    await page.waitForFunction(
      () => {
        const root = document.getElementById("root");
        return root && root.innerHTML.trim().length > 0;
      },
      { timeout: 30000 }
    );

    // Additional wait for any animations/lazy content
    await page.evaluate(
      () => new Promise((resolve) => setTimeout(resolve, 2000))
    );

    // Get the HTML content
    let html = await page.content();

    // Update meta tags for this language
    html = await updateHtmlMeta(html, lang);

    // Determine output path - output to dist/website/{lang}/{route}/index.html
    const routePath = route.slice(1); // Remove leading slash
    const outputPath = path.join(distDir, "website", routePath, "index.html");
    const outputDir = path.dirname(outputPath);

    // Create directory if it doesn't exist
    await mkdir(outputDir, { recursive: true });

    // Write the prerendered HTML
    await writeFile(outputPath, html, "utf8");

    console.log(`✅ Saved: website/${routePath}/index.html`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to prerender ${route}: ${error.message}`);

    // Debug: take a screenshot
    try {
      const bodyHTML = await page.evaluate(
        () => document.body?.innerHTML?.substring(0, 300) || "No body"
      );
      console.log(`   📝 Body: ${bodyHTML.substring(0, 150)}...`);
    } catch (debugError) {
      // Ignore debug errors
    }
    return false;
  } finally {
    await page.close();
  }
}

async function cleanupOldFiles() {
  console.log("🧹 Cleaning up old prerendered files in dist/website/...");

  // Only remove the prerendered language subdirectories inside dist/website/
  // Keep dist/{lang}/ folders as they are used by CloudFront function
  const websiteDir = path.join(distDir, "website");
  if (existsSync(websiteDir)) {
    for (const lang of languages) {
      const langWebsiteDir = path.join(websiteDir, lang);
      if (existsSync(langWebsiteDir)) {
        await rm(langWebsiteDir, { recursive: true, force: true });
        console.log(`   Removed: website/${lang}/`);
      }
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  let server = null;
  let browser = null;
  const PORT = 4173;

  try {
    // Clean up old files first
    await cleanupOldFiles();

    // Start the preview server
    server = await startPreviewServer(PORT);

    // Wait a bit for server to be fully ready
    await sleep(1000);

    const baseUrl = `http://localhost:${PORT}`;
    const allRoutes = generateAllRoutes();

    console.log(`\n📋 Routes to prerender: ${allRoutes.length}\n`);

    // Launch Puppeteer
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });

    // Prerender routes sequentially to be more reliable
    let successCount = 0;
    let failCount = 0;

    for (const routeInfo of allRoutes) {
      const success = await prerenderRoute(browser, routeInfo, baseUrl);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
      await sleep(300); // Small delay between routes
    }

    console.log(
      `\n✅ Prerendering complete! ${successCount} succeeded, ${failCount} failed.\n`
    );
  } catch (error) {
    console.error("❌ Prerendering failed:", error);
    process.exit(1);
  } finally {
    // Cleanup
    if (browser) {
      await browser.close();
    }
    if (server) {
      server.close();
    }
  }
}

main();

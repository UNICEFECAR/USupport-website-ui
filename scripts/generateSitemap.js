import fs from "fs";
import path from "path";

export function generateSitemap({
  siteUrl,
  languages,
  defaultLang,
  routes,
  outDir,
  fileName,
}) {
    const lastmod = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
  >
  ${routes
    .map((route) => {
      const priority = route === "/" ? "1.0" : "0.8";
      const pathPart = route === "/" ? "" : route;
      const defaultUrl = `${siteUrl}/${defaultLang}${pathPart}`;
  
      const alternates = languages
        .map(
          (lang) => `
      <xhtml:link
        rel="alternate"
        hreflang="${lang}"
        href="${siteUrl}/${lang}${pathPart}" />`
        )
        .join("");
  
      return `
    <url>
      <loc>${defaultUrl}</loc>
  ${alternates}
      <xhtml:link
        rel="alternate"
        hreflang="x-default"
        href="${defaultUrl}" />
      <lastmod>${lastmod}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>${priority}</priority>
    </url>`;
    })
    .join("")}
  </urlset>`;


  fs.writeFileSync(path.join(outDir, fileName), sitemap, "utf8");

  console.log("✅ sitemap.xml generated");
}

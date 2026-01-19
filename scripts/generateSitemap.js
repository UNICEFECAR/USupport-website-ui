import fs from "fs";
import path from "path";

export function generateSitemap({
  siteUrl,
  languages,
  defaultLang,
  routes,
  outDir,
}) {
    const lastmod = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const urlsetOpen = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
`;

  const urlsetClose = `</urlset>`;

  const urls = routes
    .map((route) => {
      const priority = route === "/" ? "1.0" : "0.8";
      const defaultUrl = `${siteUrl}/${defaultLang}${route}`;

      const alternates = languages
        .map(
          (lang) => `
    <xhtml:link
      rel="alternate"
      hreflang="${lang}"
      href="${siteUrl}/${lang}${route}" />`
        )
        .join("");

      return `
  <url>
    <loc>${defaultUrl}</loc>${alternates}
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>${alternates}

    <xhtml:link
      rel="alternate"
      hreflang="x-default"
      href="${defaultUrl}" />
  </url>`;
    })
    .join("");

  const sitemap = urlsetOpen + urls + "\n" + urlsetClose;

  fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemap, "utf8");

  console.log("✅ sitemap.xml generated");
}

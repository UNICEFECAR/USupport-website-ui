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
  const lastmod = new Date().toISOString().split("T")[0];

  const buildUrl = (lang, route) => {
    const pathPart = route === "/" ? "" : route;
    return `${siteUrl}/${lang}${pathPart}`;
  };

  const sitemapEntries = [];

  routes.forEach((route) => {
    const priority = route === "/" ? "1.0" : "0.8";

    languages.forEach((lang) => {
      const loc = buildUrl(lang, route);

      const alternates = languages
        .map((altLang) => {
          const href = buildUrl(altLang, route);
          return `    <xhtml:link
        rel="alternate"
        hreflang="${altLang}"
        href="${href}" />`;
        })
        .join("\n");

      sitemapEntries.push(`
  <url>
    <loc>${loc}</loc>
${alternates}
    <xhtml:link
      rel="alternate"
      hreflang="x-default"
      href="${buildUrl(defaultLang, route)}" />
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`);
    });
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${sitemapEntries.join("\n")}
</urlset>`;

  fs.writeFileSync(path.join(outDir, fileName), sitemap, "utf8");

  console.log("✅ sitemap.xml generated with proper multi-language support");
}

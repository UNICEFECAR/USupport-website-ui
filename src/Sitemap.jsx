import { useEffect } from "react";

const Sitemap = () => {
  useEffect(() => {
    const sitemapUrl =
      window.location.origin +
      import.meta.env.BASE_URL +
      "sitemap.xml";

    fetch(sitemapUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch sitemap");
        }
        return res.text();
      })
      .then((xml) => {
        const blob = new Blob([xml], {
          type: "application/xml;charset=utf-8",
        });

        const blobUrl = URL.createObjectURL(blob);

        // IMPORTANT: replace, not assign
        window.location.replace(blobUrl);
      })
      .catch((err) => {
        console.error(err);
        document.body.innerText = "Sitemap unavailable";
      });
  }, []);

  return null;
};

export default Sitemap;

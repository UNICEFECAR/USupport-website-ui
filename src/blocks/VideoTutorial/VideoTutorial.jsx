import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { VideoPlayer, CustomCarousel } from "@USupport-components-library/src";
import { ThemeContext } from "@USupport-components-library/utils";

import "./video-tutorial.scss";

/**
 * VideoTutorial
 *
 * Renders only the videos in a carousel (no parent wrapper/title)
 *
 * @return {jsx}
 */
export const VideoTutorial = () => {
  const { t, i18n } = useTranslation("blocks", { keyPrefix: "video-tutorial" });

  const { cookieState, setCookieState } = useContext(ThemeContext);

  const IS_KZ_COUNTRY = localStorage.getItem("country") === "KZ";

  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const allowedLangs = ["kk", "ru"];

  const shouldShow = IS_KZ_COUNTRY && allowedLangs.includes(i18n.language);

  const KZ_PLAYLIST_ID = "PLAuQrsWZrgDhnfcN4Dh-GlzLwUUxbRwPy";
  const RU_PLAYLIST_ID = "PLAuQrsWZrgDjv8gKsAIVcup3qu81RfMrf";

  const playlistId = i18n.language === "kk" ? KZ_PLAYLIST_ID : RU_PLAYLIST_ID;

  useEffect(() => {
    if (!shouldShow) return;
    let isMounted = true;

    async function fetchPlaylistItems() {
      try {
        setIsLoading(true);
        setError("");
        setVideos([]);

        const rssUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`;

        // Try direct RSS fetch first (may fail due to CORS)
        const tryFetchRss = async () => {
          const response = await fetch(rssUrl);
          if (!response.ok) {
            throw new Error(`Failed to load playlist (${response.status})`);
          }
          const xmlText = await response.text();
          const parser = new window.DOMParser();
          const xmlDoc = parser.parseFromString(xmlText, "text/xml");
          const entries = Array.from(xmlDoc.getElementsByTagName("entry"));
          const parsed = entries
            .map((entry) => {
              const idNode =
                entry.getElementsByTagName("yt:videoId")[0] ||
                entry.getElementsByTagName("videoId")[0];
              const titleNode = entry.getElementsByTagName("title")[0];
              const videoId = idNode ? idNode.textContent : "";
              const title = titleNode ? titleNode.textContent : "";
              return { videoId, title };
            })
            .filter((item) => item.videoId);
          return parsed;
        };

        // Fallback via rss2json (CORS-friendly)
        const tryFetchRssJson = async () => {
          const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
            rssUrl
          )}`;
          const res = await fetch(apiUrl);
          if (!res.ok) {
            throw new Error(`Fallback failed (${res.status})`);
          }
          const data = await res.json();
          const items = Array.isArray(data?.items) ? data.items : [];
          const parsed = items
            .map((item) => {
              const link = item?.link || ""; // e.g., https://www.youtube.com/watch?v=VIDEOID&list=...
              const match = link.match(/[?&]v=([^&]+)/);
              const videoId = match ? match[1] : "";
              const title = item?.title || "";
              return { videoId, title };
            })
            .filter((v) => v.videoId);
          return parsed;
        };

        let parsed = [];
        try {
          parsed = await tryFetchRss();
        } catch (_) {
          parsed = await tryFetchRssJson();
        }

        if (isMounted) {
          setVideos(parsed);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || "Failed to load videos");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (playlistId) {
      fetchPlaylistItems();
    }

    return () => {
      isMounted = false;
    };
  }, [playlistId, shouldShow]);

  const renderSlides = () => {
    return videos.map((video, index) => (
      <div key={video.videoId || index} className="video-tutorial__slide">
        <VideoPlayer
          videoId={video.videoId}
          title={video.title || t("tutorial_video_title") || "Tutorial Video"}
          cookieState={cookieState}
          setCookieState={setCookieState}
          t={t}
          className="video-tutorial__player"
        />
      </div>
    ));
  };

  const responsiveItems = {
    desktop: { breakpoint: { max: 5000, min: 1366 }, items: 3 },
    smallLaptop: { breakpoint: { max: 1366, min: 1024 }, items: 3 },
    tablet: { breakpoint: { max: 1024, min: 768 }, items: 2 },
    mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
  };

  if (!shouldShow || isLoading || error || videos.length === 0) return null;

  return (
    <CustomCarousel
      classes="video-tutorial__carousel"
      breakpointItems={responsiveItems}
      autoPlay={false}
    >
      {renderSlides()}
    </CustomCarousel>
  );
};

import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

import { Block, VideoPlayer } from "@USupport-components-library/src";
import { ThemeContext } from "@USupport-components-library/utils";

import "./video-tutorial.scss";

/**
 * VideoTutorial
 *
 * Block to showcase video tutorials
 *
 * @return {jsx}
 */
export const VideoTutorial = () => {
  const { t, i18n } = useTranslation("blocks", { keyPrefix: "video-tutorial" });

  const { cookieState, setCookieState } = useContext(ThemeContext);

  const IS_KZ_COUNTRY = localStorage.getItem("country") === "KZ";
  const allowedLangs = ["kk", "ru"];

  if (!IS_KZ_COUNTRY || !allowedLangs.includes(i18n.language)) {
    return null;
  }

  const KZ_PLAYLIST_ID = "PLAuQrsWZrgDhnfcN4Dh-GlzLwUUxbRwPy";
  const RU_PLAYLIST_ID = "PLAuQrsWZrgDjv8gKsAIVcup3qu81RfMrf";

  const playlistId = i18n.language === "kk" ? KZ_PLAYLIST_ID : RU_PLAYLIST_ID;

  return (
    <Block classes="video-tutorial">
      <div className="video-tutorial__container">
        <h2 className="video-tutorial__title">{t("title")}</h2>

        {/* Example usage of the VideoPlayer component */}
        <VideoPlayer
          playlistId={playlistId}
          title={t("tutorial_video_title") || "Tutorial Video"}
          cookieState={cookieState}
          setCookieState={setCookieState}
          t={t}
          className="video-tutorial__player"
        />
      </div>
    </Block>
  );
};

import React from "react";
import { useTranslation } from "react-i18next";

import { PhSectionIntro } from "../../components/PhSectionIntro/PhSectionIntro";
import { PhVideoPlayer } from "../../components/PhVideoPlayer/PhVideoPlayer";

import "./ph-intro-video.scss";

/**
 * PhIntroVideo
 *
 * "Welcome to Play and Heal" - introductory video on the homepage
 *
 * @param {Object} video - introduction video from usePhResources
 * @returns {JSX.Element}
 */
export const PhIntroVideo = ({ video }) => {
  const { t } = useTranslation("playandheal", { keyPrefix: "home.intro_video" });

  return (
    <section
      className="ph-intro-video"
      id="ph-intro-video"
      aria-labelledby="ph-intro-video-heading"
    >
      <PhSectionIntro
        classes="ph-intro-video__intro"
        id="ph-intro-video-heading"
        eyebrow={t("eyebrow")}
        heading={t("heading")}
        description={t("text")}
      />
      <div className="ph-intro-video__player">
        <PhVideoPlayer
          src={video?.videoUrl}
          poster={video?.image}
          title={t("video_title")}
        />
      </div>
    </section>
  );
};

import React from "react";
import { useTranslation } from "react-i18next";

import { PhSectionIntro } from "../../components/PhSectionIntro/PhSectionIntro";
import { PhVideoPlayer } from "../../components/PhVideoPlayer/PhVideoPlayer";
import { PH_INTRO_VIDEO_ID } from "../../config";

import "./ph-intro-video.scss";

/**
 * PhIntroVideo
 *
 * "Welcome to Play and Heal" - introductory video on the homepage
 *
 * @param {Array} videos - competency videos from usePhResources
 * @returns {JSX.Element}
 */
export const PhIntroVideo = ({ videos = [] }) => {
  const { t } = useTranslation("playandheal", { keyPrefix: "home.intro_video" });

  const video =
    videos.find((x) => String(x.id) === String(PH_INTRO_VIDEO_ID)) ||
    videos[0];

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

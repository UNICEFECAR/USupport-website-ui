import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { PhModal } from "../../components/PhModal/PhModal";
import { PhVideoPlayer } from "../../components/PhVideoPlayer/PhVideoPlayer";
import { PhIcon } from "../../components/PhIcon/PhIcon";
import { usePhTrackView } from "../../hooks/usePhTrackView";

import "./ph-video-modal.scss";

/**
 * PhVideoModal
 *
 * Plays a competency microvideo
 *
 * @param {object} resource - video resource from usePhResources, or null
 * @param {function} onClose
 * @returns {JSX.Element}
 */
export const PhVideoModal = ({ resource, onClose }) => {
  const { t } = useTranslation("playandheal", { keyPrefix: "video_player" });
  const trackView = usePhTrackView();

  useEffect(() => {
    if (resource?.id) trackView(resource);
  }, [resource?.id]);

  return (
    <PhModal
      isOpen={!!resource}
      onClose={onClose}
      heading={resource?.title}
      description={resource?.description}
    >
      {resource && (
        <>
          <PhVideoPlayer
            src={resource.videoUrl}
            poster={resource.image}
            title={resource.title}
          />
          {resource.externalUrl && (
            <a
              className="ph-video-modal__external"
              href={resource.externalUrl}
              target="_blank"
              rel="noreferrer"
            >
              <span>{t("open_external")}</span>
              <PhIcon name="arrow-up-right" size={18} />
            </a>
          )}
        </>
      )}
    </PhModal>
  );
};

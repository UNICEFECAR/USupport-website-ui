import React from "react";

import { PhVideoPlayer } from "../../components/PhVideoPlayer/PhVideoPlayer";
import { usePhTrackView } from "../../hooks/usePhTrackView";

import "./ph-featured-video.scss";

/**
 * PhFeaturedVideo
 *
 * Full-width homepage video. Its title is only announced to screen readers
 * and its poster is the CMS thumbnail. Renders nothing when the current
 * language has no featured video.
 *
 * @param {Object} video - featured video from usePhResources
 * @returns {JSX.Element|null}
 */
export const PhFeaturedVideo = ({ video }) => {
  const trackView = usePhTrackView();

  if (!video) return null;

  return (
    <section className="ph-featured-video" aria-label={video.title}>
      <PhVideoPlayer
        src={video.videoUrl}
        poster={video.image}
        title={video.title}
        showTitle={false}
        onStart={() => trackView(video)}
      />
    </section>
  );
};

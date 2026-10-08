import React, { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  HHAudioPlayer,
  HHLoadingRegion,
  HHMediaFrame,
  HHSegmentedControl,
  HHSkeleton,
} from "@USupport-components-library/src/hosnelhal";

import "./asset-viewer.scss";

// hls.js and pdf.js are only downloaded when a video or PDF is opened
const HHHlsVideo = lazy(() =>
  import("@USupport-components-library/src/hosnelhal/components/HHHlsVideo").then(
    (module) => ({ default: module.HHHlsVideo })
  )
);
const HHPdfViewer = lazy(() =>
  import("@USupport-components-library/src/hosnelhal/components/HHPdfViewer").then(
    (module) => ({ default: module.HHPdfViewer })
  )
);

/**
 * AssetViewer
 *
 * Shows an asset in the browser: video, audio, PDF or image. Audios that came
 * with a picture play as video, with a switch to listen only (less data).
 *
 * @param {object} asset - see utils/assets
 * @param {function} onDownload - called when the PDF toolbar download is used
 * @returns {JSX.Element}
 */
export const AssetViewer = ({ asset, onDownload }) => {
  const { t } = useTranslation("hosnelhal");
  const [isListenOnly, setIsListenOnly] = useState(false);
  const status = (message) => <p className="hosn-asset-viewer__status">{message}</p>;
  const hasAudioVideo = asset.format === "audio" && Boolean(asset.audioVideoUrl);

  const mediaLabels = {
    play: t("media.play"),
    pause: t("media.pause"),
    seek: t("media.seek"),
    mute: t("media.mute"),
    unmute: t("media.unmute"),
    fullscreen: t("media.fullscreen"),
  };

  const renderContent = () => {
    switch (asset.format) {
      case "video":
        return asset.video.url ? (
          <HHHlsVideo
            src={asset.video.url}
            poster={asset.image}
            title={asset.title}
            labels={mediaLabels}
          />
        ) : (
          status(t("asset.video_processing"))
        );

      case "audio":
        if (!asset.audioUrl) return status(t("asset.audio_processing"));
        if (hasAudioVideo && !isListenOnly) {
          return (
            <HHHlsVideo
              src={asset.audioVideoUrl}
              poster={asset.image}
              title={asset.title}
              labels={mediaLabels}
            />
          );
        }
        return (
          <HHAudioPlayer
            src={asset.audioUrl}
            cover={asset.image}
            title={asset.title}
            labels={{ ...mediaLabels, play: t("media.play_audio"), pause: t("media.pause_audio") }}
          />
        );

      default:
        if (asset.view.isPdf) {
          return (
            <HHPdfViewer
              url={asset.view.url}
              onDownload={onDownload}
              loading={
                <HHLoadingRegion label={t("pdf.loading")}>
                  <HHSkeleton width="55rem" aspectRatio="595 / 842" className="hosn-asset-viewer__page" />
                </HHLoadingRegion>
              }
              error={t("pdf.error")}
              labels={{
                previousPage: t("pdf.previous_page"),
                nextPage: t("pdf.next_page"),
                pageOf: (page, total) => t("pdf.page_of", { page, total }),
                zoomIn: t("pdf.zoom_in"),
                zoomOut: t("pdf.zoom_out"),
                print: t("pdf.print"),
                download: t("pdf.download"),
              }}
            />
          );
        }
        return asset.view.url ? (
          <img src={asset.view.url} alt={asset.description || asset.title} />
        ) : (
          status(t("asset.not_found"))
        );
    }
  };

  return (
    <div className="hosn-asset-viewer">
      <HHMediaFrame>
        <Suspense
          fallback={
            <HHLoadingRegion label={t("common.loading")}>
              <HHSkeleton aspectRatio="880 / 493" radius="none" />
            </HHLoadingRegion>
          }
        >
          {renderContent()}
        </Suspense>
      </HHMediaFrame>

      {hasAudioVideo && (
        <HHSegmentedControl
          label={t("media.playback_mode")}
          value={isListenOnly ? "audio" : "video"}
          onChange={(mode) => setIsListenOnly(mode === "audio")}
          options={[
            { value: "video", label: t("media.with_visuals") },
            { value: "audio", label: t("media.listen_only") },
          ]}
        />
      )}
    </div>
  );
};

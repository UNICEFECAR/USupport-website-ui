// Maps Strapi hosn-asset entries to the shape used by the Hosn El Hal pages
import { cmsSvc } from "@USupport-components-library/services";

const getMediaUrl = (media) => media?.data?.attributes?.url || null;

const getMediaMime = (media) => media?.data?.attributes?.mime || "";

const getImageUrl = (media) => {
  const attributes = media?.data?.attributes;
  const { medium, small } = attributes?.formats || {};
  return medium?.url || small?.url || attributes?.url || null;
};

const isImage = (media) => getMediaMime(media).startsWith("image/");

const getDurationMinutes = (attributes) => {
  if (attributes.duration_minutes) return attributes.duration_minutes;
  const seconds =
    attributes.video?.duration_seconds || attributes.audio?.duration_seconds;
  return seconds ? Math.max(1, Math.round(seconds / 60)) : null;
};

/**
 * Download options per format, the first one is the main download
 */
const getDownloads = ({
  format,
  video,
  audio,
  file_web,
  file_print,
  file_mobile,
}) => {
  if (format === "video") {
    return video?.download_url ? [{ type: "video", url: video.download_url }] : [];
  }
  if (format === "audio") {
    return audio?.audio_url ? [{ type: "audio", url: audio.audio_url }] : [];
  }

  // Main file, then the print-ready and mobile-friendly versions
  return [
    { type: format, url: getMediaUrl(file_web) },
    { type: "print", url: getMediaUrl(file_print) },
    { type: "mobile", url: getMediaUrl(file_mobile) },
  ].filter(({ url }, index, all) => url && all.findIndex((x) => x.url === url) === index);
};

/**
 * @param {object} entry - Strapi entry ({ id, attributes })
 * @returns {object} asset
 */
export const toAsset = ({ id, attributes }) => {
  const viewFile = attributes.file_web?.data ? attributes.file_web : attributes.file_print;

  return {
    id,
    locale: attributes.locale,
    format: attributes.format,
    title: attributes.title,
    description: attributes.description || "",
    durationMinutes: getDurationMinutes(attributes),
    pageCount: attributes.page_count || null,
    image:
      getImageUrl(attributes.cover_image) ||
      (isImage(viewFile) ? getImageUrl(viewFile) : null),
    video: {
      url: attributes.video?.hls_url || null,
      status: attributes.video?.status || null,
    },
    audioUrl: attributes.audio?.audio_url || null,
    // Video version of an audio upload that came with a picture
    audioVideoUrl: attributes.audio?.video_hls_url || null,
    // What the page shows for worksheets and thumbnails (image or PDF)
    view: {
      url: getMediaUrl(viewFile),
      isPdf: getMediaMime(viewFile) === "application/pdf",
      isImage: isImage(viewFile),
    },
    downloads: getDownloads(attributes),
    usageTips: attributes.how_to_use || [],
  };
};

/**
 * Length shown with the format, e.g. "6 min" or "5 pages" for a PDF
 *
 * @param {object} asset - see toAsset
 * @param {function} t - translate function of the "hosnelhal" namespace
 * @returns {string|null}
 */
export const getLengthLabel = (asset, t) => {
  if (asset.format === "worksheet" && asset.pageCount) {
    return t("card.pages", { count: asset.pageCount });
  }
  return asset.durationMinutes ? t("card.minutes", { count: asset.durationMinutes }) : null;
};

/**
 * Count a download; failures must never block the download itself
 *
 * @param {number} id - asset id
 */
export const trackDownload = (id) => {
  cmsSvc.addHosnAssetDownloadCount(id).catch(() => {});
};

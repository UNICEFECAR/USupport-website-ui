import React from "react";
import { useTranslation } from "react-i18next";

import { HHDownloadPanel } from "@USupport-components-library/src/hosnelhal";

import { trackDownload } from "../../utils/assets";

/**
 * AssetDownloads
 *
 * Download options of an asset, e.g. the PDF and its print-ready version
 *
 * @param {object} asset - see utils/assets
 * @returns {JSX.Element|null}
 */
export const AssetDownloads = ({ asset }) => {
  const { t } = useTranslation("hosnelhal", { keyPrefix: "asset" });

  if (!asset.downloads.length) return null;

  return (
    <HHDownloadPanel
      title={t("download_title")}
      text={t("download_text")}
      note={t("no_account")}
      options={asset.downloads.map(({ type, url }) => ({
        href: url,
        label: t(`download_${type}`),
        onClick: () => trackDownload(asset.id),
      }))}
    />
  );
};

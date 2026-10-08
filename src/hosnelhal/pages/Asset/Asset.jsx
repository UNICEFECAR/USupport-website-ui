import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Markdown } from "@USupport-components-library/src";
import {
  HHBackLink,
  HHButton,
  HHLoadingRegion,
  HHMediaFrame,
  HHSkeleton,
  HHPageIntro,
  HHPanel,
  HHSplitLayout,
} from "@USupport-components-library/src/hosnelhal";
import { cmsSvc } from "@USupport-components-library/services";

import { AssetDownloads } from "../../blocks/AssetDownloads/AssetDownloads";
import { AssetViewer } from "../../blocks/AssetViewer/AssetViewer";
import { HOSN_RTL_LANGUAGES } from "../../config";
import { useHosnAsset } from "../../hooks/useHosnAssets";
import { useHosnPath } from "../../hooks/useHosnPath";
import { getLengthLabel, trackDownload } from "../../utils/assets";

import "./asset.scss";

/**
 * Asset
 *
 * A single resource: viewer, download options and how to use it
 *
 * @returns {JSX.Element}
 */
export const Asset = () => {
  const { id } = useParams();
  const { t } = useTranslation("hosnelhal");
  const toPath = useHosnPath();
  const { data: asset, isLoading, isError } = useHosnAsset(id);

  useEffect(() => {
    if (asset?.id) cmsSvc.addHosnAssetViewCount(asset.id).catch(() => {});
  }, [asset?.id]);

  const backLink = <HHBackLink to={toPath("resources")}>{t("asset.back")}</HHBackLink>;

  if (isLoading) {
    return (
      <HHLoadingRegion label={t("common.loading")} className="hh__container hh__stack">
        {backLink}
        <HHSkeleton width="9rem" height="1.4rem" />
        <div className="hosn-asset__intro-skeleton">
          <HHSkeleton width="min(60rem, 80%)" height="3.2rem" />
          <HHSkeleton width="min(44rem, 60%)" height="1.7rem" />
        </div>
        <HHSplitLayout
          main={
            <HHMediaFrame>
              <HHSkeleton aspectRatio="880 / 493" radius="none" />
            </HHMediaFrame>
          }
          aside={<HHSkeleton height="22.8rem" radius="lg" />}
        />
      </HHLoadingRegion>
    );
  }

  if (isError || !asset) {
    return (
      <div className="hh__container hh__stack">
        {backLink}
        <p className="hosn-asset__status" role="status">
          {t("asset.not_found")}
        </p>
      </div>
    );
  }

  const meta = [t(`formats.${asset.format}`), getLengthLabel(asset, t)]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="hh__container hh__stack hosn-asset">
      {backLink}
      <p className="hosn-asset__meta">{meta}</p>

      {/* The asset may be in another language than the interface */}
      <div
        className="hh__stack"
        lang={asset.locale}
        dir={HOSN_RTL_LANGUAGES.includes(asset.locale) ? "rtl" : "ltr"}
      >
        <HHPageIntro title={asset.title} lead={asset.description} />
        <HHSplitLayout
          main={<AssetViewer asset={asset} onDownload={() => trackDownload(asset.id)} />}
          aside={<AssetDownloads asset={asset} />}
        />
      </div>

      <HHPanel className="hosn-asset__how" aria-labelledby="hosn-asset-how">
        <h2 id="hosn-asset-how">{t("asset.how_title")}</h2>
        {asset.usageTips.length > 0 ? (
          <dl className="hosn-asset__tips">
            {asset.usageTips.map((tip) => (
              <div key={tip.id} className="hosn-asset__tip">
                <dt>{t(`asset.setting_${tip.setting}`)}</dt>
                <dd>
                  <Markdown markDownText={tip.text} />
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p>{t("asset.how_text")}</p>
        )}
      </HHPanel>

      <HHButton variant="text" to={toPath("how-to-use")} className="hosn-asset__how-link">
        {t("asset.how_link")}
      </HHButton>
    </div>
  );
};

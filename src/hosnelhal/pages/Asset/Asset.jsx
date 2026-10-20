import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  HHBackLink,
  HHButton,
  HHLoadingRegion,
  HHMediaFrame,
  HHSkeleton,
  HHPageIntro,
  HHPanel,
} from "@USupport-components-library/src/hosnelhal";
import { cmsSvc } from "@USupport-components-library/services";

import { AssetViewer } from "../../blocks/AssetViewer/AssetViewer";
import { HOSN_RTL_LANGUAGES } from "../../config";
import { useHosnTrackView } from "../../hooks/useHosnTrackView";
import { useHosnAsset } from "../../hooks/useHosnAssets";
import { useHosnPath } from "../../hooks/useHosnPath";
import { getLengthLabel } from "../../utils/assets";

import "./asset.scss";

/**
 * Asset
 *
 * A single resource: viewer and how to use it
 *
 * @returns {JSX.Element}
 */
export const Asset = () => {
  const { id } = useParams();
  const { t } = useTranslation("hosnelhal");
  const toPath = useHosnPath();
  const trackView = useHosnTrackView();
  const { data: asset, isLoading, isError } = useHosnAsset(id);

  useEffect(() => {
    if (!asset?.id) return;
    // Lifetime counter in CMS + dated engagement event for country admin
    cmsSvc.addHosnAssetViewCount(asset.id).catch(() => {});
    trackView(asset.id);
  }, [asset?.id, trackView]);

  const backLink = (
    <HHBackLink to={toPath("resources")}>{t("asset.back")}</HHBackLink>
  );

  if (isLoading) {
    return (
      <HHLoadingRegion
        label={t("common.loading")}
        className="hh__container hh__stack"
      >
        {backLink}
        <HHSkeleton width="9rem" height="1.4rem" />
        <div className="hosn-asset__intro-skeleton">
          <HHSkeleton width="min(60rem, 80%)" height="3.2rem" />
          <HHSkeleton width="min(44rem, 60%)" height="1.7rem" />
        </div>
        <HHMediaFrame>
          <HHSkeleton aspectRatio="880 / 493" radius="none" />
        </HHMediaFrame>
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
        <HHPageIntro
          eyebrow={t("asset.eyebrow")}
          title={asset.title}
          lead={asset.description}
        />
        <AssetViewer asset={asset} />
      </div>

      <HHPanel className="hosn-asset__how" aria-labelledby="hosn-asset-how">
        <h2 id="hosn-asset-how">{t("asset.how_title")}</h2>
        <p>{asset.howToUse || t("asset.how_text")}</p>
        {asset.supportReminder ? (
          <p className="hosn-asset__support-reminder">{asset.supportReminder}</p>
        ) : null}
      </HHPanel>

      {asset.supportReminder ? (
        <HHButton
          variant="text"
          to={toPath("when-you-need-more-support")}
          className="hosn-asset__how-link"
        >
          {t("support_note.link")}
        </HHButton>
      ) : null}

      <HHButton
        variant="text"
        to={toPath("how-to-use")}
        className="hosn-asset__how-link"
      >
        {t("asset.how_link")}
      </HHButton>
    </div>
  );
};

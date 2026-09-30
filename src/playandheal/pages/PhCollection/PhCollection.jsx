import React from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { cmsSvc } from "@USupport-components-library/services";

import { PhBackLink } from "../../components/PhBackLink/PhBackLink";
import { PhPageBanner } from "../../components/PhPageBanner/PhPageBanner";
import { PhCallout } from "../../components/PhCallout/PhCallout";
import { PhIcon } from "../../components/PhIcon/PhIcon";
import { PhPdfReader } from "../../components/PhPdfReader/PhPdfReader";
import { PhResourceCard } from "../../components/PhResourceCard/PhResourceCard";
import { usePhPath } from "../../hooks/usePhPath";
import { usePhResources } from "../../hooks/usePhResources";
import { useResourceViewer } from "../../hooks/useResourceViewer";
import { PH_COLLECTIONS, PH_LANGUAGES } from "../../config";

import "./ph-collection.scss";

const CALLOUT_ICONS = { booklet: "book", cards: "cards", videos: "refresh" };

/**
 * PhCollection
 *
 * Toolkit collection page - foundational booklet (inline reader), activity
 * cards or competency microvideos
 *
 * @returns {JSX.Element}
 */
export const PhCollection = () => {
  const { collectionSlug } = useParams();
  const { t, i18n } = useTranslation("playandheal", { keyPrefix: "collection" });
  const { t: tCommon } = useTranslation("playandheal", { keyPrefix: "common" });
  const toPath = usePhPath();
  const resources = usePhResources();
  const { openResource, viewer } = useResourceViewer();

  const collectionKey = Object.keys(PH_COLLECTIONS).find(
    (key) => PH_COLLECTIONS[key].slug === collectionSlug
  );

  if (!collectionKey) return <Navigate to={toPath("")} replace />;

  const collection = PH_COLLECTIONS[collectionKey];
  const items = resources[collectionKey];
  const isBooklet = collectionKey === "booklet";
  const isVideos = collectionKey === "videos";
  const languageName = PH_LANGUAGES.find(
    (x) => x.value === i18n.language
  )?.name;

  const renderContent = () => {
    if (resources.isLoading) {
      return (
        <p className="ph-collection__status" role="status">
          {t("loading")}
        </p>
      );
    }

    if (resources.isError) {
      return (
        <p className="ph-collection__status" role="alert">
          {t("error")}
        </p>
      );
    }

    if (items.length === 0) {
      return <p className="ph-collection__status">{t("empty")}</p>;
    }

    // A single booklet is read inline on the page
    if (isBooklet && items.length === 1) {
      const booklet = items[0];
      return (
        <div className="ph-collection__reader">
          <h3 className="ph-collection__reader-heading">
            {t("booklet.read_here")}
          </h3>
          <PhPdfReader
            pdfUrl={booklet.pdfUrl}
            language={languageName}
            showMeta={false}
            onDownload={() =>
              cmsSvc.addArticleDownloadCount(booklet.id).catch(() => {})
            }
          />
        </div>
      );
    }

    return (
      <ul className="ph-collection__grid">
        {items.map((item) => (
          <li key={item.id}>
            <PhResourceCard resource={item} onOpen={openResource} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="ph__container ph__stack ph-collection">
      <div className="ph-page-top">
        <PhBackLink to={`${toPath("")}#ph-toolkit`}>
          {tCommon("back_to_toolkit")}
        </PhBackLink>
        <PhPageBanner
          tone={collection.tone}
          icon={collection.icon}
          eyebrow={t("eyebrow")}
          heading={t(`${collectionKey}.title`)}
          description={t(`${collectionKey}.text`)}
        />
      </div>

      <section
        className="ph-collection__content"
        aria-labelledby="ph-collection-heading"
      >
        <div className="ph-collection__heading-row">
          <h2 className="ph-collection__heading" id="ph-collection-heading">
            {isBooklet ? t("booklet.title") : t("explore")}
          </h2>
          {!resources.isLoading && items.length > 0 && (
            <p className="ph-collection__count">
              {t(isVideos ? "video_count" : "resource_count", {
                count: items.length,
              })}
            </p>
          )}
        </div>

        {renderContent()}

        <p className="ph-collection__hint">
          {t(isVideos ? "hint_videos" : "hint_documents")}
        </p>
      </section>

      <PhCallout
        tone={collection.tone}
        icon={CALLOUT_ICONS[collectionKey]}
        title={t(`${collectionKey}.callout_title`)}
      >
        {t(`${collectionKey}.callout_text`)}
      </PhCallout>

      <Link to={toPath("/how-it-works")} className="ph-collection__how-to">
        <span>{tCommon("how_to_use")}</span>
        <PhIcon name="arrow" size={20} />
      </Link>

      {viewer}
    </div>
  );
};

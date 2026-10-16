import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  HHCardGrid,
  HHLink,
  HHLoadingRegion,
  HHPageIntro,
  HHResourceCardSkeleton,
  HHSkeleton,
} from "@USupport-components-library/src/hosnelhal";

import { ResourceFilters } from "../../blocks/ResourceFilters/ResourceFilters";
import { ResourceGrid } from "../../blocks/ResourceGrid/ResourceGrid";
import { HOSN_CATEGORY_PREVIEW, HOSN_FORMATS, HOSN_LIBRARY_PATH } from "../../config";
import { useHosnAssets, useHosnPillars } from "../../hooks/useHosnAssets";
import { useHosnPath } from "../../hooks/useHosnPath";
import { FILTER_KEYS, toSearchString } from "../../hooks/useResourceFilters";

import "./resources.scss";

const NO_FILTERS = Object.fromEntries(FILTER_KEYS.map((key) => [key, ""]));

const buildCategories = (pillars, assets) => {
  const byPillar = {};
  assets.forEach((asset) => {
    if (!asset.pillar) return;
    byPillar[asset.pillar] = byPillar[asset.pillar] || [];
    byPillar[asset.pillar].push(asset);
  });

  return pillars
    .map((pillar) => {
      const items = byPillar[pillar.value] || [];
      return {
        pillar,
        items,
        preview: items.slice(0, HOSN_CATEGORY_PREVIEW),
      };
    })
    .filter((category) => category.items.length > 0);
};

const formatSummary = (items, t, tFormats, separator) =>
  HOSN_FORMATS.map((format) => {
    const count = items.filter((asset) => asset.format === format).length;
    return count ? t("resources.format_count", { count, format: tFormats(format) }) : null;
  })
    .filter(Boolean)
    .join(separator);

const CategorySkeleton = () => (
  <div className="hosn-resources__category" aria-hidden="true">
    <div className="hosn-resources__intro">
      <HHSkeleton width="16rem" height="2.3rem" />
      <HHSkeleton lines={4} height="1.5rem" />
      <HHSkeleton width="10rem" height="1.5rem" />
    </div>
    <div className="hosn-resources__cards">
      <HHCardGrid>
        {Array.from({ length: HOSN_CATEGORY_PREVIEW }, (_, index) => (
          <HHResourceCardSkeleton key={index} />
        ))}
      </HHCardGrid>
    </div>
  </div>
);

/**
 * Resources
 *
 * A few resources from each category. "View all" opens the full library
 * with that category already selected.
 *
 * @returns {JSX.Element}
 */
export const Resources = () => {
  const { language } = useParams();
  const navigate = useNavigate();
  const toPath = useHosnPath();
  const { t } = useTranslation("hosnelhal");
  const { t: tFormats } = useTranslation("hosnelhal", { keyPrefix: "formats" });

  const pillarsQuery = useHosnPillars(language);
  const assetsQuery = useHosnAssets({ locale: language });

  const categories = useMemo(
    () => buildCategories(pillarsQuery.data || [], assetsQuery.data || []),
    [pillarsQuery.data, assetsQuery.data]
  );

  const goToLibrary = (filters) =>
    navigate(`${toPath(HOSN_LIBRARY_PATH)}${toSearchString(filters)}`);

  const exploreLead = [].concat(t("resources.explore_lead", { returnObjects: true }) || []);
  const isLoading = pillarsQuery.isLoading || assetsQuery.isLoading;
  const isError = pillarsQuery.isError || assetsQuery.isError;

  return (
    <div className="hh__container hh__stack hosn-resources">
      <HHPageIntro
        eyebrow={t("resources.eyebrow")}
        title={t("resources.all")}
        lead={t("resources.lead")}
      />

      <ResourceFilters filters={NO_FILTERS} onChange={goToLibrary} onReset={() => {}} />

      <section className="hosn-resources__explore" aria-labelledby="hosn-explore-intro">
        <h2 id="hosn-explore-intro">{t("resources.explore_title")}</h2>
        {exploreLead.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </section>

      {isLoading ? (
        <HHLoadingRegion className="hosn-resources__categories" label={t("common.loading")}>
          <CategorySkeleton />
          <CategorySkeleton />
        </HHLoadingRegion>
      ) : isError ? (
        <p className="hosn-resources__status" role="status">
          {t("common.error")}
        </p>
      ) : categories.length === 0 ? (
        <p className="hosn-resources__status" role="status">
          {t("filters.no_resources")}
        </p>
      ) : (
        <div className="hosn-resources__categories">
          {categories.map(({ pillar, items, preview }) => {
            const headingId = `hosn-category-${pillar.value}`;
            const summary = formatSummary(items, t, tFormats, language === "ar" ? "، " : ", ");
            const description =
              pillar.description ||
              t(`resources.pillars.${pillar.value}`, { defaultValue: "" });

            return (
              <section
                key={pillar.value}
                className="hosn-resources__category"
                data-pillar={pillar.value}
                aria-labelledby={headingId}
              >
                <div className="hosn-resources__intro">
                  <h2 id={headingId}>{pillar.label}</h2>
                  {description &&
                    description.split(/\n\n+/).map((paragraph, index) => (
                      <p key={index} className="hosn-resources__description">
                        {paragraph}
                      </p>
                    ))}
                  <div className="hosn-resources__stats">
                    <p className="hosn-resources__count">
                      {t("resources.count", { count: items.length })}
                    </p>
                    {summary && <p className="hosn-resources__formats">{summary}</p>}
                  </div>
                </div>

                <div className="hosn-resources__cards">
                  <ResourceGrid assets={preview} labelledBy={headingId} />
                  <HHLink
                    className="hosn-resources__view-all"
                    to={`${toPath(HOSN_LIBRARY_PATH)}${toSearchString({ topic: pillar.value })}`}
                    aria-label={t("resources.view_all_label", {
                      count: items.length,
                      category: pillar.label,
                    })}
                  >
                    {t("resources.view_all", { count: items.length })}
                  </HHLink>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};

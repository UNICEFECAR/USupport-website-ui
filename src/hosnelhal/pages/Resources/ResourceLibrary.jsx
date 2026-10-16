import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { HHPageIntro, HHSectionHeader } from "@USupport-components-library/src/hosnelhal";

import { ResourceFilters } from "../../blocks/ResourceFilters/ResourceFilters";
import { ResourceGrid } from "../../blocks/ResourceGrid/ResourceGrid";
import { useHosnAssets, useHosnPillars } from "../../hooks/useHosnAssets";
import { toAssetQuery, useResourceFilters } from "../../hooks/useResourceFilters";

/**
 * ResourceLibrary
 *
 * The full library with search and filters. Opened from the resources
 * overview with a category already selected (`?topic=`).
 *
 * @returns {JSX.Element}
 */
export const ResourceLibrary = () => {
  const { language } = useParams();
  const { t } = useTranslation("hosnelhal");
  const { filters, setFilters, resetFilters } = useResourceFilters();
  const { data: pillars = [] } = useHosnPillars(language);

  const { data, isLoading, isError } = useHosnAssets(toAssetQuery(filters, language));

  const topic = pillars.find((pillar) => pillar.value === filters.topic);

  return (
    <div className="hh__container hh__stack">
      <HHPageIntro
        eyebrow={t("resources.eyebrow")}
        title={t("resources.title")}
        lead={t("resources.lead")}
      />

      <ResourceFilters filters={filters} onChange={setFilters} onReset={resetFilters} />

      <section className="hh__stack" aria-labelledby="hosn-resources-title">
        <HHSectionHeader
          id="hosn-resources-title"
          title={topic?.label || t("resources.all")}
        />
        <ResourceGrid
          assets={data}
          isLoading={isLoading}
          isError={isError}
          labelledBy="hosn-resources-title"
          skeletonCount={8}
          emptyMessage={
            Object.values(filters).some(Boolean)
              ? t("filters.no_results")
              : t("filters.no_resources")
          }
        />
      </section>
    </div>
  );
};

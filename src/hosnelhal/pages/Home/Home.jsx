import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { HHPageIntro, HHSectionHeader } from "@USupport-components-library/src/hosnelhal";

import { ResourceFilters } from "../../blocks/ResourceFilters/ResourceFilters";
import { ResourceGrid } from "../../blocks/ResourceGrid/ResourceGrid";
import { UsageGuidance } from "../../blocks/UsageGuidance/UsageGuidance";
import { HOSN_FEATURED_COUNT } from "../../config";
import { useHosnAssets } from "../../hooks/useHosnAssets";
import { useHosnPath } from "../../hooks/useHosnPath";
import { FILTER_KEYS, toSearchString } from "../../hooks/useResourceFilters";

const NO_FILTERS = Object.fromEntries(FILTER_KEYS.map((key) => [key, ""]));

/**
 * Home
 *
 * Introduction, search, the latest resources and how to use the hub.
 * Searching or filtering continues on the resources page.
 *
 * @returns {JSX.Element}
 */
export const Home = () => {
  const { language } = useParams();
  const navigate = useNavigate();
  const toPath = useHosnPath();
  const { t } = useTranslation("hosnelhal", { keyPrefix: "home" });

  const { data, isLoading, isError } = useHosnAssets({
    locale: language,
    limit: HOSN_FEATURED_COUNT,
  });

  const goToResources = (filters) =>
    navigate(`${toPath("resources")}${toSearchString(filters)}`);

  return (
    <div className="hh__container hh__stack">
      <HHPageIntro variant="hero" eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

      <ResourceFilters filters={NO_FILTERS} onChange={goToResources} onReset={() => {}} />

      <section className="hh__stack" aria-labelledby="hosn-explore-title">
        <HHSectionHeader
          id="hosn-explore-title"
          title={t("explore")}
          action={{ to: toPath("resources"), label: t("view_all") }}
        />
        <ResourceGrid
          assets={data}
          isLoading={isLoading}
          isError={isError}
          labelledBy="hosn-explore-title"
          skeletonCount={HOSN_FEATURED_COUNT}
        />
      </section>

      <UsageGuidance />
    </div>
  );
};

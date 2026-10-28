import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { HHSectionHeader } from "@USupport-components-library/src/hosnelhal";

import { FeelingPicker } from "../../blocks/FeelingPicker/FeelingPicker";
import { HomeHero } from "../../blocks/HomeHero/HomeHero";
import { NewToHosn } from "../../blocks/NewToHosn/NewToHosn";
import { ResourceGrid } from "../../blocks/ResourceGrid/ResourceGrid";
import { YouMatter } from "../../blocks/YouMatter/YouMatter";
import { HOSN_HOME_FEATURED, HOSN_LIBRARY_PATH } from "../../config";
import { useHosnAssets } from "../../hooks/useHosnAssets";
import { useHosnPath } from "../../hooks/useHosnPath";

import "./home.scss";

/**
 * Home
 *
 * Welcome, "How are you feeling today?", a few featured resources and the
 * way into How to Use
 *
 * @returns {JSX.Element}
 */
export const Home = () => {
  const { language } = useParams();
  const toPath = useHosnPath();
  const { t } = useTranslation("hosnelhal", { keyPrefix: "home" });

  const featuredIds = HOSN_HOME_FEATURED[language] || [];
  const { data, isLoading, isError } = useHosnAssets({
    locale: language,
    ids: featuredIds,
  });

  return (
    <div className="hh__container hh__stack hosn-home">
      <HomeHero />

      <FeelingPicker />

      <section className="hh__stack hosn-home__featured" aria-labelledby="hosn-explore-title">
        <div className="hosn-home__featured-intro">
          <HHSectionHeader
            id="hosn-explore-title"
            title={t("explore_title")}
            action={{ to: toPath(HOSN_LIBRARY_PATH), label: t("view_all") }}
          />
          <p className="hosn-home__featured-lead">{t("explore_lead")}</p>
          <p className="hosn-home__featured-lead">{t("explore_hint")}</p>
        </div>
        <ResourceGrid
          assets={data}
          isLoading={isLoading}
          isError={isError}
          labelledBy="hosn-explore-title"
          skeletonCount={featuredIds.length}
        />
      </section>

      <YouMatter />

      <NewToHosn />
    </div>
  );
};

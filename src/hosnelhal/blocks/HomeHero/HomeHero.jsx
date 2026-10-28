import React from "react";
import { useTranslation } from "react-i18next";

import { HHButton } from "@USupport-components-library/src/hosnelhal";

import { useHosnPath } from "../../hooks/useHosnPath";

import "./home-hero.scss";

/**
 * HomeHero
 *
 * Welcome banner on the home page: the copy sits on the olive part of the
 * illustration, which is mirrored for Arabic
 *
 * @returns {JSX.Element}
 */
export const HomeHero = () => {
  const toPath = useHosnPath();
  const { t } = useTranslation("hosnelhal", { keyPrefix: "home" });

  return (
    <section className="hosn-home-hero" aria-labelledby="hosn-home-title">
      <div className="hosn-home-hero__copy">
        <p className="hosn-home-hero__eyebrow">{t("welcome")}</p>
        <h1 className="hosn-home-hero__title" id="hosn-home-title">
          {t("headline")}
        </h1>
        {t("lead", { returnObjects: true }).map((paragraph) => (
          <p key={paragraph} className="hosn-home-hero__lead">
            {paragraph}
          </p>
        ))}
        <HHButton
          to={toPath("resources")}
          className="hosn-home-hero__cta hosn-home__pill"
        >
          {t("explore_cta")}
        </HHButton>
      </div>
    </section>
  );
};

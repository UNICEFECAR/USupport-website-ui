import React from "react";
import { useTranslation } from "react-i18next";

import { HHButton, HHPageIntro, HHPanel } from "@USupport-components-library/src/hosnelhal";

import { useHosnPath } from "../../hooks/useHosnPath";

import illustration from "../../assets/about-illustration.png";

import "./about.scss";

/**
 * About
 *
 * Background of the Hosn El Hal programme
 *
 * @returns {JSX.Element}
 */
export const About = () => {
  const { t } = useTranslation("hosnelhal", { keyPrefix: "about" });
  const toPath = useHosnPath();

  return (
    <div className="hh__container hh__stack hosn-about">
      <HHPageIntro title={t("title")} lead={t("lead")} />

      <section className="hosn-about__programme" aria-labelledby="hosn-about-background">
        <img className="hosn-about__illustration" src={illustration} alt="" />
        <div className="hosn-about__copy">
          <h2 id="hosn-about-background">{t("background_title")}</h2>
          <p>{t("background_text_1")}</p>
          <p>{t("background_text_2")}</p>
          <p className="hosn-about__closing">{t("background_text_3")}</p>
        </div>
      </section>

      <HHPanel className="hosn-about__hub" aria-labelledby="hosn-about-hub">
        <h2 id="hosn-about-hub">{t("hub_title")}</h2>
        <p>{t("hub_text")}</p>
      </HHPanel>

      <HHButton className="hosn-about__explore" to={toPath("resources")}>
        {t("explore")}
      </HHButton>
    </div>
  );
};

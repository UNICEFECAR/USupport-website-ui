import React from "react";
import { useTranslation } from "react-i18next";

import { PhButton } from "../../components/PhButton/PhButton";
import { usePhPath } from "../../hooks/usePhPath";

import "./ph-getting-started.scss";

const STEPS = ["step_1", "step_2", "step_3"];

/**
 * PhGettingStarted
 *
 * "New to Play and Heal?" - three first steps and a link to the how-to page
 *
 * @returns {JSX.Element}
 */
export const PhGettingStarted = () => {
  const { t } = useTranslation("playandheal", {
    keyPrefix: "home.getting_started",
  });
  const toPath = usePhPath();

  return (
    <section
      className="ph-getting-started"
      aria-labelledby="ph-getting-started-heading"
    >
      <div className="ph-getting-started__intro">
        <p className="ph-getting-started__eyebrow">{t("eyebrow")}</p>
        <h2
          className="ph-getting-started__heading"
          id="ph-getting-started-heading"
        >
          {t("heading")}
        </h2>
        <p className="ph-getting-started__text">{t("text")}</p>
        <PhButton
          to={toPath("/how-it-works")}
          icon="arrow"
          classes="ph-getting-started__cta"
        >
          {t("cta")}
        </PhButton>
      </div>

      <ol className="ph-getting-started__steps">
        {STEPS.map((step, index) => (
          <li key={step} className="ph-getting-started__step">
            <span className="ph-getting-started__number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="ph-getting-started__step-content">
              <span className="ph-getting-started__step-title">
                {t(`${step}_title`)}
              </span>
              <span className="ph-getting-started__step-text">
                {t(`${step}_text`)}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
};

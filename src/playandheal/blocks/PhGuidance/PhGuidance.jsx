import React from "react";
import { useTranslation } from "react-i18next";

import "./ph-guidance.scss";

const ITEMS = ["selection", "age_groups", "partnership", "support"];

/**
 * PhGuidance
 *
 * "Guidance for facilitators" - four practical notes on the How to page
 *
 * @returns {JSX.Element}
 */
export const PhGuidance = () => {
  const { t } = useTranslation("playandheal", { keyPrefix: "how_to.guidance" });

  return (
    <section className="ph-guidance" aria-labelledby="ph-guidance-heading">
      <h2 className="ph-guidance__heading" id="ph-guidance-heading">
        {t("heading")}
      </h2>
      <ul className="ph-guidance__grid">
        {ITEMS.map((item) => (
          <li key={item} className="ph-guidance__card">
            <h3 className="ph-guidance__title">{t(`${item}_title`)}</h3>
            <p className="ph-guidance__text">{t(`${item}_text`)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

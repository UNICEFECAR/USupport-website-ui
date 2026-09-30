import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";

import { PhSectionIntro } from "../../components/PhSectionIntro/PhSectionIntro";

import safetyImage from "../../assets/character-safety.png";
import connectionImage from "../../assets/character-connection.png";
import expressionImage from "../../assets/character-expression.png";
import masteryImage from "../../assets/character-mastery.png";
import selfImage from "../../assets/character-self.png";

import "./ph-characters.scss";

// The five characteristics of healing and their official characters
const CHARACTERS = [
  { key: "safety", image: safetyImage, tone: "mint" },
  { key: "connection", image: connectionImage, tone: "lavender" },
  { key: "expression", image: expressionImage, tone: "pink" },
  { key: "mastery", image: masteryImage, tone: "lavender" },
  { key: "self", image: selfImage, tone: "sand" },
];

/**
 * PhCharacters
 *
 * Five characteristics of healing. Hover or tap a character to reveal its
 * characteristic; tap again to close.
 *
 * @param {string} copyKey - translation group for the intro, "home" or "about"
 * @returns {JSX.Element}
 */
export const PhCharacters = ({ copyKey = "home" }) => {
  const { t } = useTranslation("playandheal", { keyPrefix: "characters" });
  const [revealed, setRevealed] = useState(null);

  const toggle = (key) => setRevealed((prev) => (prev === key ? null : key));

  return (
    <section
      className="ph-characters"
      aria-labelledby={`ph-characters-heading-${copyKey}`}
    >
      <PhSectionIntro
        id={`ph-characters-heading-${copyKey}`}
        eyebrow={t(`${copyKey}.eyebrow`)}
        heading={t(`${copyKey}.heading`)}
        description={t(`${copyKey}.text`, { defaultValue: "" }) || undefined}
      />

      <ul className="ph-characters__list">
        {CHARACTERS.map(({ key, image, tone }) => {
          const isRevealed = revealed === key;
          const detailsId = `ph-character-${copyKey}-${key}`;

          return (
            <li key={key}>
              <button
                type="button"
                className={classNames(
                  "ph-characters__card",
                  `ph-characters__card--${tone}`,
                  isRevealed && "ph-characters__card--revealed"
                )}
                onClick={() => toggle(key)}
                aria-expanded={isRevealed}
                aria-controls={detailsId}
              >
                <span className="ph-characters__front">
                  <img src={image} alt="" loading="lazy" />
                  <span className="ph-characters__name">{t(`${key}.name`)}</span>
                  <span className="ph-characters__hint">{t("hint")}</span>
                </span>
                <span className="ph-characters__back" id={detailsId}>
                  <img src={image} alt="" loading="lazy" />
                  <span className="ph-characters__name">{t(`${key}.name`)}</span>
                  <span className="ph-characters__quote">
                    {t(`${key}.quote`)}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

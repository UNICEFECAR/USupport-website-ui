import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";

import { PhSectionIntro } from "../../components/PhSectionIntro/PhSectionIntro";
import { PhButton } from "../../components/PhButton/PhButton";

import safetyImage from "../../assets/character-safety.png";
import connectionImage from "../../assets/character-connection.png";
import expressionImage from "../../assets/character-expression.png";
import masteryImage from "../../assets/character-mastery.png";
import selfImage from "../../assets/character-self.png";

import "./ph-characters.scss";

// The five characteristics of healing and their official characters.
// Each card uses its character's colour (--ph-character-<key>).
const CHARACTERS = [
  { key: "safety", image: safetyImage },
  { key: "connection", image: connectionImage },
  { key: "expression", image: expressionImage },
  { key: "mastery", image: masteryImage },
  { key: "self", image: selfImage },
];

/**
 * PhCharacters
 *
 * Five characteristics of healing. By default, hover or tap a character to
 * reveal its quote; tap again to close. With `showDescriptions` each card
 * shows a short description of its characteristic instead.
 *
 * @param {string} copyKey - translation group for the intro, "home" or "about"
 * @param {boolean} showDescriptions - static cards with descriptions
 * @param {Object} cta - optional { label, to } button below the cards
 * @returns {JSX.Element}
 */
export const PhCharacters = ({
  copyKey = "home",
  showDescriptions = false,
  cta,
}) => {
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
        {CHARACTERS.map(({ key, image }) => {
          if (showDescriptions) {
            return (
              <li
                key={key}
                className={classNames(
                  "ph-characters__card",
                  "ph-characters__card--static",
                  `ph-characters__card--${key}`
                )}
              >
                <img src={image} alt="" loading="lazy" />
                <h3 className="ph-characters__name">{t(`${key}.name`)}</h3>
                <p className="ph-characters__description">
                  {t(`${key}.description`)}
                </p>
              </li>
            );
          }

          const isRevealed = revealed === key;
          const detailsId = `ph-character-${copyKey}-${key}`;

          return (
            <li key={key}>
              <button
                type="button"
                className={classNames(
                  "ph-characters__card",
                  `ph-characters__card--${key}`,
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

      {cta && (
        <PhButton to={cta.to} icon="arrow" classes="ph-characters__cta">
          {cta.label}
        </PhButton>
      )}
    </section>
  );
};

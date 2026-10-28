import React from "react";
import { useTranslation } from "react-i18next";

import {
  HHGuidanceItem,
  HHPanel,
} from "@USupport-components-library/src/hosnelhal";

import iconMe from "../../assets/icon-me.svg";
import iconTeam from "../../assets/icon-team.svg";
import iconSchool from "../../assets/icon-school.svg";

import "./usage-guidance.scss";

// Each way sits on one of the soft card backgrounds from the home page
const ITEMS = [
  { key: "me", icon: iconMe, tint: "reconnect" },
  { key: "team", icon: iconTeam, tint: "supported" },
  { key: "school", icon: iconSchool, tint: "energy" },
];

/**
 * UsageGuidance
 *
 * The three ways to use the hub: for me, my team and my school
 *
 * @param {string} title - section title
 * @returns {JSX.Element}
 */
export const UsageGuidance = ({ title }) => {
  const { t } = useTranslation("hosnelhal", { keyPrefix: "usage" });

  return (
    <HHPanel className="hosn-usage-guidance" aria-labelledby="hosn-usage-title">
      <h2 className="hosn-usage-guidance__title" id="hosn-usage-title">
        {title || t("title")}
      </h2>
      <ul className="hosn-usage-guidance__items">
        {ITEMS.map(({ key, icon, tint }) => (
          <li
            key={key}
            className={`hosn-usage-guidance__item hosn-usage-guidance__item--${tint}`}
          >
            <HHGuidanceItem
              icon={icon}
              title={t(`${key}_title`)}
              text={t(`${key}_text`)}
            />
          </li>
        ))}
      </ul>
    </HHPanel>
  );
};

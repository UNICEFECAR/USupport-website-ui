import React from "react";
import { useTranslation } from "react-i18next";

import { HHGuidanceItem, HHPanel } from "@USupport-components-library/src/hosnelhal";

import iconMe from "../../assets/icon-me.png";
import iconTeam from "../../assets/icon-team.png";
import iconSchool from "../../assets/icon-school.png";

import "./usage-guidance.scss";

const ITEMS = [
  { key: "me", icon: iconMe },
  { key: "team", icon: iconTeam },
  { key: "school", icon: iconSchool },
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
      <div className="hosn-usage-guidance__items">
        {ITEMS.map(({ key, icon }) => (
          <HHGuidanceItem
            key={key}
            icon={icon}
            title={t(`${key}_title`)}
            text={t(`${key}_text`)}
          />
        ))}
      </div>
    </HHPanel>
  );
};

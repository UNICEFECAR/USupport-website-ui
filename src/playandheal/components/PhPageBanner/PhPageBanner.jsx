import React from "react";
import classNames from "classnames";

import { PhIcon } from "../PhIcon/PhIcon";

import "./ph-page-banner.scss";

/**
 * PhPageBanner
 *
 * Coloured banner at the top of inner pages with an icon tile, eyebrow,
 * page title and description
 *
 * @param {string} tone - "lavender" | "mint" | "sand" | "pink"
 * @param {string} icon - icon name shown in the tile
 * @returns {JSX.Element}
 */
export const PhPageBanner = ({
  tone = "lavender",
  icon,
  eyebrow,
  heading,
  description,
}) => {
  return (
    <header className={classNames("ph-page-banner", `ph-page-banner--${tone}`)}>
      <div className="ph-page-banner__icon">
        <PhIcon name={icon} size={40} />
      </div>
      <div className="ph-page-banner__content">
        {eyebrow && <p className="ph-page-banner__eyebrow">{eyebrow}</p>}
        <h1 className="ph-page-banner__heading">{heading}</h1>
        {description && (
          <p className="ph-page-banner__description">{description}</p>
        )}
      </div>
    </header>
  );
};

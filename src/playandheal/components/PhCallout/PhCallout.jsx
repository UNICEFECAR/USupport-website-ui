import React from "react";
import classNames from "classnames";

import { PhIcon } from "../PhIcon/PhIcon";

import "./ph-callout.scss";

/**
 * PhCallout
 *
 * Tinted guidance box with an icon, title and body text
 *
 * @param {string} tone - "lavender" | "mint" | "sand" | "subtle"
 * @returns {JSX.Element}
 */
export const PhCallout = ({ tone = "lavender", icon, title, children }) => {
  return (
    <aside className={classNames("ph-callout", `ph-callout--${tone}`)}>
      {icon && (
        <span className="ph-callout__icon">
          <PhIcon name={icon} size={28} />
        </span>
      )}
      <div className="ph-callout__content">
        {title && <p className="ph-callout__title">{title}</p>}
        <p className="ph-callout__text">{children}</p>
      </div>
    </aside>
  );
};

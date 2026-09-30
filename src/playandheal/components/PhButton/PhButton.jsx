import React from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";

import { PhIcon } from "../PhIcon/PhIcon";

import "./ph-button.scss";

/**
 * PhButton
 *
 * Pill button with an optional trailing icon. Renders a router Link when `to`
 * is given, an anchor when `href` is given and a button otherwise.
 *
 * @param {string} tone - "primary" | "text"
 * @param {string} icon - trailing icon name
 * @param {string} to - internal route
 * @param {string} href - external url
 * @param {boolean} fullWidth - stretch the button to its container
 * @returns {JSX.Element}
 */
export const PhButton = ({
  tone = "primary",
  icon,
  to,
  href,
  fullWidth = false,
  classes,
  children,
  ...rest
}) => {
  const className = classNames(
    "ph-button",
    `ph-button--${tone}`,
    fullWidth && "ph-button--full-width",
    classes
  );

  const content = (
    <>
      <span className="ph-button__label">{children}</span>
      {icon && <PhIcon name={icon} size={20} />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={className} {...rest}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={className} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={className} {...rest}>
      {content}
    </button>
  );
};

import React from "react";
import { Link } from "react-router-dom";

import { PhIcon } from "../PhIcon/PhIcon";

import "./ph-back-link.scss";

/**
 * PhBackLink
 *
 * "Back to ..." link shown above the page banner
 *
 * @param {string} to - route to go back to
 * @returns {JSX.Element}
 */
export const PhBackLink = ({ to, children }) => {
  return (
    <Link to={to} className="ph-back-link">
      <PhIcon name="arrow-back" size={18} />
      <span>{children}</span>
    </Link>
  );
};

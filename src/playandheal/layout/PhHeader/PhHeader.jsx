import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import classNames from "classnames";

import { usePhPath } from "../../hooks/usePhPath";
import { PH_LANGUAGES } from "../../config";
import { PhLanguageSelect } from "./PhLanguageSelect";

import logo from "../../assets/logo.png";

import "./ph-header.scss";

/**
 * PhHeader
 *
 * Play and Heal header with logo, main navigation, uSupport attribution
 * and language selector. On mobile the navigation wraps to its own rows.
 *
 * @param {string} language - current language
 * @param {function} onLanguageChange - language change handler
 * @returns {JSX.Element}
 */
export const PhHeader = ({ language, onLanguageChange }) => {
  const { t } = useTranslation("playandheal", { keyPrefix: "header" });
  const toPath = usePhPath();

  const links = [
    { to: toPath(""), label: t("home"), end: true },
    { to: toPath("/how-it-works"), label: t("how_to") },
    { to: toPath("/about-us"), label: t("about_us") },
    { to: toPath("/caregivers"), label: t("caregivers") },
  ];

  return (
    <header className="ph-header">
      <div className="ph__container ph-header__inner">
        <Link to={toPath("")} className="ph-header__brand">
          <img src={logo} alt={t("logo_alt")} width="62" height="62" />
        </Link>

        <nav className="ph-header__nav" aria-label={t("navigation_label")}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                classNames(
                  "ph-header__link",
                  isActive && "ph-header__link--active"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ph-header__utilities">
          <a
            className="ph-header__host"
            href="https://usupport.online"
            target="_blank"
            rel="noreferrer"
          >
            {t("on_usupport")}
          </a>

          <PhLanguageSelect
            languages={PH_LANGUAGES}
            value={language}
            onChange={onLanguageChange}
            label={t("language_label")}
          />
        </div>
      </div>
    </header>
  );
};

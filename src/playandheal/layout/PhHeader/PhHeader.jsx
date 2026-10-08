import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import classNames from "classnames";

import { useScrollLock } from "@USupport-components-library/src/utils/scrollLock";

import { usePhPath } from "../../hooks/usePhPath";
import { PH_LANGUAGES } from "../../config";
import { PhLanguageSelect } from "./PhLanguageSelect";

import { getPhLogo } from "../../assets/logos";

import "./ph-header.scss";

const NAV_ID = "ph-main-nav";

// Must match $ph-bp-lg in styles/_ph.scss - the burger is used below it
const DESKTOP_QUERY = "(min-width: 1100px)";

/**
 * PhHeader
 *
 * Play and Heal header with logo, main navigation, uSupport attribution
 * and language selector. Below the desktop breakpoint the navigation
 * collapses into a burger menu.
 *
 * @param {string} language - current language
 * @param {function} onLanguageChange - language change handler
 * @returns {JSX.Element}
 */
export const PhHeader = ({ language, onLanguageChange }) => {
  const { t } = useTranslation("playandheal", { keyPrefix: "header" });
  const toPath = usePhPath();
  const { pathname } = useLocation();

  const headerRef = useRef(null);
  const burgerRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useScrollLock(isMenuOpen);

  // Close after navigating
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Close if the window grows to the desktop layout while open
  useEffect(() => {
    if (!isMenuOpen) return;
    const query = window.matchMedia(DESKTOP_QUERY);
    const handleChange = (e) => e.matches && setIsMenuOpen(false);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, [isMenuOpen]);

  // Escape closes and returns focus to the burger
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        burgerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  // Tabbing out of the header closes the menu
  const handleBlur = (e) => {
    if (isMenuOpen && !headerRef.current?.contains(e.relatedTarget)) {
      setIsMenuOpen(false);
    }
  };

  const links = [
    { to: toPath(""), label: t("home"), end: true },
    { to: toPath("/how-it-works"), label: t("how_to") },
    { to: toPath("/about-us"), label: t("about_us") },
    { to: toPath("/caregivers"), label: t("caregivers") },
  ];

  const hostLink = (className) => (
    <a
      className={className}
      href="https://usupport.online"
      target="_blank"
      rel="noreferrer"
    >
      {t("on_usupport")}
    </a>
  );

  return (
    <>
      <header
        className={classNames(
          "ph-header",
          isMenuOpen && "ph-header--menu-open"
        )}
        ref={headerRef}
        onBlur={handleBlur}
      >
        <div className="ph__container ph-header__inner">
          <Link to={toPath("")} className="ph-header__brand">
            <img
              src={getPhLogo(language)}
              alt={t("logo_alt")}
              width="62"
              height="62"
            />
          </Link>

          <nav
            id={NAV_ID}
            className="ph-header__nav"
            aria-label={t("navigation_label")}
          >
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
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            {hostLink("ph-header__host ph-header__host--menu")}
          </nav>

          <div className="ph-header__utilities">
            {hostLink("ph-header__host ph-header__host--bar")}

            <PhLanguageSelect
              languages={PH_LANGUAGES}
              value={language}
              onChange={onLanguageChange}
              label={t("language_label")}
            />

            <button
              type="button"
              ref={burgerRef}
              className="ph-header__burger"
              aria-expanded={isMenuOpen}
              aria-controls={NAV_ID}
              aria-label={isMenuOpen ? t("menu_close") : t("menu_open")}
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <span className="ph-header__burger-bar" />
              <span className="ph-header__burger-bar" />
              <span className="ph-header__burger-bar" />
            </button>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div
          className="ph-header__backdrop"
          aria-hidden="true"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
};

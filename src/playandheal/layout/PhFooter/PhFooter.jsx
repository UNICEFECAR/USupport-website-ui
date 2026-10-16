import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { ThemeContext } from "@USupport-components-library/utils";

import { usePhPath } from "../../hooks/usePhPath";

import { getPhLogo } from "../../assets/logos";

import "./ph-footer.scss";

/**
 * PhFooter
 *
 * Play and Heal footer with logo, tagline and secondary links
 *
 * @returns {JSX.Element}
 */
export const PhFooter = () => {
  const { t, i18n } = useTranslation("playandheal", { keyPrefix: "footer" });
  const { cookieState, setCookieState } = useContext(ThemeContext);
  const toPath = usePhPath();

  const openCookieSettings = () => {
    setCookieState({
      ...cookieState,
      isBannerOpen: true,
    });
  };

  return (
    <footer className="ph-footer">
      <div className="ph__container ph-footer__inner">
        <div className="ph-footer__row">
          <img
            className="ph-footer__logo"
            src={getPhLogo(i18n.language)}
            alt=""
            width="62"
            height="62"
          />
          <div className="ph-footer__meta">
            <nav
              className="ph-footer__links"
              aria-label={t("navigation_label")}
            >
              <Link to={toPath("/about-us")}>{t("about_us")}</Link>
              <Link to={toPath("/how-it-works")}>{t("how_to_use")}</Link>
              <Link to={toPath("/cookie-policy")}>{t("cookie_policy")}</Link>
              <button type="button" onClick={openCookieSettings}>
                {t("cookie_settings")}
              </button>
            </nav>
            <p className="ph-footer__host">{t("hosted_on")}</p>
          </div>
        </div>
        <p className="ph-footer__tagline">{t("tagline")}</p>
      </div>
    </footer>
  );
};

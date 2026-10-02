import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { Helmet } from "react-helmet";

import { CookieBanner } from "@USupport-components-library/src";
import { ThemeContext } from "@USupport-components-library/utils";

import { PhHeader } from "../PhHeader/PhHeader";
import { PhFooter } from "../PhFooter/PhFooter";
import { PhWaitlistModal } from "../../modals/PhWaitlistModal/PhWaitlistModal";
import {
  PH_COUNTRY,
  PH_RTL_LANGUAGES,
  PH_SHOW_WAITLIST,
} from "../../config";

import "../../styles/ph-theme.scss";

const PhLayoutContext = createContext({ openWaitlist: () => {} });

export const usePhLayout = () => useContext(PhLayoutContext);

const getScrollBehavior = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";

/**
 * PhLayout
 *
 * Shell for every Play and Heal page: header, footer, fonts, text direction,
 * cookie banner and the shared waiting-list modal.
 *
 * @returns {JSX.Element}
 */
export const PhLayout = ({ children }) => {
  const { language = "en" } = useParams();
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { t } = useTranslation("playandheal", { keyPrefix: "common" });
  const { t: tPage } = useTranslation("blocks", { keyPrefix: "page" });
  const { cookieState, setCookieState } = useContext(ThemeContext);

  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const dir = PH_RTL_LANGUAGES.includes(language) ? "rtl" : "ltr";

  // Visitors reaching the site through the subdomain may not have a country yet
  useEffect(() => {
    if (localStorage.getItem("country") !== PH_COUNTRY) {
      localStorage.setItem("country", PH_COUNTRY);
      window.dispatchEvent(new Event("countryChanged"));
    }
  }, []);

  useEffect(() => {
    if (i18n.language !== language) i18n.changeLanguage(language);
    localStorage.setItem("language", language);
  }, [language, i18n]);

  const previousPathnameRef = useRef(pathname);

  // Hash links on the same page scroll smoothly; arriving from another page
  // jumps straight to the section (or to the top when there is no hash)
  useEffect(() => {
    const isSamePage = previousPathnameRef.current === pathname;
    previousPathnameRef.current = pathname;

    const target = hash && document.getElementById(hash.slice(1));
    if (target) {
      target.scrollIntoView({
        behavior: isSamePage ? getScrollBehavior() : "auto",
      });
    } else if (!isSamePage || !hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  // Stop the browser's instant jump for in-page links like href="#ph-toolkit"
  // and route them through the smooth scroll above
  const handleHashLinkClick = (e) => {
    // The skip link keeps its native behaviour so keyboard focus moves too
    const link = e.target.closest?.("a[href^='#']:not(.ph__skip-link)");
    if (!link || e.defaultPrevented || e.metaKey || e.ctrlKey) return;

    const targetHash = link.getAttribute("href");
    const target = document.getElementById(targetHash.slice(1));
    if (!target) return;

    e.preventDefault();
    if (targetHash === hash) {
      // Already on this hash - the location won't change, so scroll directly
      target.scrollIntoView({ behavior: getScrollBehavior() });
    } else {
      navigate({ pathname, search, hash: targetHash });
    }
  };

  const handleLanguageChange = (newLanguage) => {
    const rest = pathname.split("/").filter(Boolean).slice(1).join("/");
    navigate(`/${newLanguage}${rest ? `/${rest}` : ""}${search}`);
  };

  const openWaitlist = useCallback(() => setIsWaitlistOpen(true), []);

  return (
    <PhLayoutContext.Provider value={{ openWaitlist }}>
      <Helmet htmlAttributes={{ lang: language, dir }}>
        <title>{t("site_title")}</title>
        <meta name="description" content={t("site_description")} />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap"
        />
      </Helmet>

      <div
        className="ph"
        dir={dir}
        lang={language}
        onClick={handleHashLinkClick}
      >
        <a className="ph__skip-link" href="#ph-main">
          {t("skip_to_content")}
        </a>
        <PhHeader language={language} onLanguageChange={handleLanguageChange} />
        <main className="ph__main" id="ph-main" tabIndex={-1}>
          {children}
        </main>
        <PhFooter />
        {PH_SHOW_WAITLIST && (
          <PhWaitlistModal
            isOpen={isWaitlistOpen}
            onClose={() => setIsWaitlistOpen(false)}
          />
        )}
      </div>

      <CookieBanner
        cookieState={cookieState}
        setCookieState={setCookieState}
        text={
          <Trans
            components={[
              <Link key="cookie-policy" to={`/${language}/cookie-policy`} />,
            ]}
          >
            {tPage("cookie_banner_text")}
          </Trans>
        }
        t={tPage}
      />
    </PhLayoutContext.Provider>
  );
};

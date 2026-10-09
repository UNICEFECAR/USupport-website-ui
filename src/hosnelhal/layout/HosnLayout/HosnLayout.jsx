import React, { useContext, useEffect } from "react";
import {
  Link,
  matchPath,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";

import {
  HHCookieBanner,
  HHRoot,
  HHSiteFooter,
  HHSiteHeader,
  useFavicon,
} from "@USupport-components-library/src/hosnelhal";
import { cmsSvc } from "@USupport-components-library/services";
import { ThemeContext } from "@USupport-components-library/utils";

import { HOSN_LANGUAGES, HOSN_RTL_LANGUAGES } from "../../config";
import { useHosnPath } from "../../hooks/useHosnPath";

import logoHosnElHal from "../../assets/logo-hosnelhal.png";
import logoUnicef from "../../assets/logo-unicef.png";
import logoUnicefFooter from "../../assets/logo-unicef-footer.png";
import favicon from "../../assets/favicon.png";

import "./hosn-layout.scss";

const UNICEF_URL = "https://www.unicef.org";

const NAV_ITEMS = [
  { path: "", key: "nav_home" },
  { path: "resources", key: "nav_resources" },
  { path: "how-to-use", key: "nav_how_to_use" },
  { path: "about", key: "nav_about" },
];

const LEGAL_ITEMS = [
  { path: "privacy-policy", key: "privacy_policy" },
  { path: "terms-of-use", key: "terms_of_use" },
  { path: "cookie-policy", key: "cookie_policy" },
];

/**
 * Path of the current page in another language. Assets have a different id
 * per language, so they are looked up; without a translation the list opens.
 */
const getLocalizedPath = async (pathname, language) => {
  const assetMatch = matchPath("/:language/resources/:id", pathname);
  if (assetMatch) {
    try {
      const { data } = await cmsSvc.getHosnAssetLocales(assetMatch.params.id);
      return `/${language}/resources${data[language] ? `/${data[language]}` : ""}`;
    } catch {
      return `/${language}/resources`;
    }
  }

  const rest = pathname.split("/").filter(Boolean).slice(1).join("/");
  return `/${language}${rest ? `/${rest}` : ""}`;
};

/**
 * HosnLayout
 *
 * Shell for every Hosn El Hal page: theme, text direction, header, footer
 * and cookie banner
 *
 * @returns {JSX.Element}
 */
export const HosnLayout = ({ children }) => {
  const { language = "en" } = useParams();
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { t } = useTranslation("hosnelhal", { keyPrefix: "common" });
  const { t: tPage } = useTranslation("blocks", { keyPrefix: "page" });
  const { cookieState, setCookieState } = useContext(ThemeContext);
  const toPath = useHosnPath();

  const dir = HOSN_RTL_LANGUAGES.includes(language) ? "rtl" : "ltr";

  useFavicon(favicon);

  useEffect(() => {
    if (i18n.language !== language) i18n.changeLanguage(language);
    localStorage.setItem("language", language);
  }, [language, i18n]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const handleLanguageChange = async (newLanguage) => {
    const path = await getLocalizedPath(pathname, newLanguage);
    navigate(`${path}${matchPath("/:language/resources/:id", pathname) ? "" : search}`);
  };

  const handleCookieChoice = (hasAccepted) => {
    localStorage.setItem("acceptAllCookies", hasAccepted ? 1 : 0);
    localStorage.setItem("hasHandledCookies", 1);
    setCookieState({
      ...cookieState,
      hasAcceptedCookies: hasAccepted,
      hasHandledCookies: true,
      isBannerOpen: false,
    });
  };

  const isActive = (path) => {
    const target = toPath(path);
    return path ? pathname.startsWith(target) : pathname === target || pathname === `${target}/`;
  };

  return (
    <>
      <Helmet htmlAttributes={{ lang: language, dir }}>
        <title>{t("site_title")}</title>
        <meta name="description" content={t("site_description")} />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600;700&family=Inter:wght@400;600;700&display=swap"
        />
      </Helmet>

      <HHRoot
        dir={dir}
        lang={language}
        linkComponent={Link}
      >
        <a className="hh__skip-link" href="#hosn-main">
          {t("skip_to_content")}
        </a>

        <HHSiteHeader
          logos={[
            { src: logoHosnElHal, alt: t("logo_hosnelhal"), to: toPath("") },
            { src: logoUnicef, alt: t("logo_unicef"), size: "md", href: UNICEF_URL },
          ]}
          navLabel={t("nav_label")}
          links={NAV_ITEMS.map(({ path, key }) => ({
            to: toPath(path),
            label: t(key),
            isActive: isActive(path),
          }))}
          languages={HOSN_LANGUAGES}
          language={language}
          languageLabel={t("language_label")}
          onLanguageChange={handleLanguageChange}
        />

        <main className="hosn-main" id="hosn-main" tabIndex={-1}>
          {children}
        </main>

        <HHSiteFooter
          logoStart={{ src: logoHosnElHal, alt: t("logo_hosnelhal"), to: toPath("") }}
          logoEnd={{ src: logoUnicefFooter, alt: t("logo_unicef"), href: UNICEF_URL }}
          text={t("footer_text")}
          linksLabel={t("footer_links_label")}
          links={LEGAL_ITEMS.map(({ path, key }) => ({ to: toPath(path), label: t(key) }))}
        />

        {cookieState.isBannerOpen && (
          <HHCookieBanner
            title={tPage("cookie_banner_header")}
            text={
              <Trans
                components={[<Link key="cookie-policy" to={toPath("cookie-policy")} />]}
              >
                {tPage("cookie_banner_text")}
              </Trans>
            }
            acceptLabel={tPage("accept_all_cookies")}
            rejectLabel={tPage("reject_all_cookies")}
            onAccept={() => handleCookieChoice(true)}
            onReject={() => handleCookieChoice(false)}
          />
        )}
      </HHRoot>
    </>
  );
};

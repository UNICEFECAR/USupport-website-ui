import React, { useEffect, useState, useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation, Trans } from "react-i18next";
import classNames from "classnames";

import {
  Navbar,
  CircleIconButton,
  Footer,
  Icon,
  CookieBanner,
  AccessibilityController,
} from "@USupport-components-library/src";
import { countrySvc, userSvc } from "@USupport-components-library/services";
import {
  ThemeContext,
  replaceLanguageInUrl,
  getLanguageFromUrl,
} from "@USupport-components-library/utils";
import { PasswordModal } from "@USupport-components-library/src";

import {
  useError,
  useEventListener,
  useCustomNavigate as useNavigate,
} from "#hooks";

import "./page.scss";

const globalCountry = {
  value: "global",
  label: "Global",
  countryID: "global",
  iconName: "global",
  podcastsActive: true,
  videosActive: true,
};

/**
 * Page
 *
 * Page wrapper
 *
 * @return {jsx}
 */
export const Page = ({
  additionalPadding = true,
  showGoBackArrow = false,
  heading,
  headingButton,
  classes,
  children,
}) => {
  const {
    theme,
    setTheme,
    setAllLanguages,
    setIsPodcastsActive,
    setIsVideosActive,
    cookieState,
    setCookieState,
  } = useContext(ThemeContext);
  const navigateTo = useNavigate();
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation("blocks", { keyPrefix: "page" });
  const IS_DEV = process.env.NODE_ENV === "development";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  let localStorageCountry = localStorage.getItem("country");
  const localStorageLanguage = localStorage.getItem("language") || "en";
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorageLanguage ? { value: localStorageLanguage.toUpperCase() } : null
  );
  const [selectedCountry, setSelectedCountry] = useState();
  const [langs, setLangs] = useState([]);

  const IS_PS = localStorageCountry === "PS";

  const changeLanguage = (language) => {
    i18n.changeLanguage(language.value);
    localStorage.setItem("language", language.value);
    replaceLanguageInUrl(language);
  };

  const fetchCountries = async () => {
    const freshLocalStorageCountry = localStorage.getItem("country");
    if (freshLocalStorageCountry !== localStorageCountry) {
      localStorageCountry = freshLocalStorageCountry;
    }

    const subdomain = window.location.hostname.split(".")[0];
    const res = await countrySvc.getActiveCountriesWithLanguages();
    let hasSetDefaultCountry = false;
    if (
      subdomain &&
      subdomain !== "www" &&
      subdomain !== "usupport" &&
      subdomain !== "staging"
    ) {
      localStorageCountry =
        res.data.find((x) => x.name.toLocaleLowerCase() === subdomain)
          ?.alpha2 || localStorageCountry;
      if (localStorageCountry) {
        localStorage.setItem("country", localStorageCountry);
        // window.dispatchEvent(new Event("countryChanged"));
      }
    }

    let shouldSelectCountry = true;
    if (subdomain === "usupport" || subdomain === "staging") {
      localStorage.setItem("country", "global");

      setIsPodcastsActive(true);
      setIsVideosActive(true);

      setSelectedCountry(globalCountry);
      shouldSelectCountry = false;
      const allLanguages = res.data.reduce((acc, x) => {
        // Get all languages from each country
        // filter out duplicates
        const currentLanguages = x.languages
          .map((y) => ({
            value: y.alpha2,
            label: y.name,
            id: y["language_id"],
            localName: y["local_name"],
          }))
          .filter((k) => !acc.some((x) => x.value === k.value));
        acc.push(...currentLanguages);
        return acc;
      }, []);
      setLangs(allLanguages);
      setAllLanguages(allLanguages);
    }

    let allLanguages = [];

    const countries = res.data.map((x) => {
      const currentLanguages = x.languages.map((y) => ({
        value: y.alpha2,
        label: y.name,
        id: y["language_id"],
        localName: y["local_name"],
      }));
      allLanguages.push(...currentLanguages);

      const countryObject = {
        value: x.alpha2,
        label: x.name,
        countryID: x["country_id"],
        iconName: x.alpha2,
        currencySymbol: x["symbol"],
        localName: x["local_name"],
        languages: currentLanguages,
        podcastsActive: x.podcasts_active,
        videosActive: x.videos_active,
      };

      if (localStorageCountry === x.alpha2 && shouldSelectCountry) {
        setSelectedCountry(countryObject);
        setLangs(countryObject.languages);
        setIsPodcastsActive(countryObject.podcastsActive);
        setIsVideosActive(countryObject.videosActive);
        localStorage.setItem("currency_symbol", countryObject.currencySymbol);
      }
      return countryObject;
    });
    const languageFromUrl = getLanguageFromUrl();
    const localLanguage = localStorage.getItem("language");

    if (localLanguage || languageFromUrl) {
      let languageObject = allLanguages.find(
        (x) =>
          x.value?.toLocaleLowerCase() === languageFromUrl.toLocaleLowerCase()
      );
      if (!languageObject) {
        languageObject = allLanguages.find(
          (x) =>
            x.value?.toLocaleLowerCase() === localLanguage.toLocaleLowerCase()
        );
      }
      if (languageObject) {
        setSelectedLanguage(languageObject);
        i18n.changeLanguage(languageObject.value);
        replaceLanguageInUrl(languageObject.value);
        localStorage.setItem("language", languageObject.value);
      } else {
        changeLanguage("en");
      }
    } else {
      changeLanguage("en");
    }

    allLanguages = allLanguages.filter(
      (x, index, self) => index === self.findIndex((t) => t.value === x.value)
    );

    if (
      subdomain === "staging" &&
      (!localStorageCountry || localStorageCountry === "global")
    ) {
      localStorage.setItem("country", "global");
      setAllLanguages(allLanguages);
      setLangs(allLanguages);
      setIsPodcastsActive(true);
      setIsVideosActive(true);
    }

    if (!hasSetDefaultCountry && !localStorageCountry) {
      localStorage.setItem("country", "global");
      window.dispatchEvent(new Event("countryChanged"));
      setSelectedCountry(globalCountry);
      setLangs(allLanguages);
      setAllLanguages(allLanguages);
      setIsPodcastsActive(true);
      setIsVideosActive(true);
    }

    countries.unshift(globalCountry);

    return countries;
  };

  useEventListener("countryChanged", () => {
    queryClient.invalidateQueries({ queryKey: ["countries"] });
  });

  const { data: countries } = useQuery(["countries"], fetchCountries);
  const country = localStorage.getItem("country");

  let pages = [
    { name: t("page_1"), url: "/", exact: true, icon: "home" },
    { name: t("page_2"), url: "/how-it-works", icon: "info" },
    {
      name: t("page_3"),
      url: "/about-us",
      icon: "two-people",
    },
    {
      name: t("page_4"),
      url: "/information-portal?tab=articles",
      icon: "activities",
    },
    country === "RO"
      ? { name: t("page_7"), url: "/organizations", icon: "home" }
      : {
          name: t("page_6"),
          url: "/my-qa",
          icon: "document",
        },
  ];

  if (IS_PS) {
    pages = [
      {
        name: t("page_3"),
        url: "/about-us",
        icon: "two-people",
      },
      {
        name: t("page_4"),
        url: "/information-portal?tab=articles",
        icon: "activities",
      },
    ];
  }

  let footerLists = {
    list1: [
      {
        name: t("footer_1"),
        url: "/about-us",
      },
      { name: t("footer_2"), url: "/information-portal?tab=articles" },
      { name: t("page_6"), url: "/my-qa" },
    ],
    list2: [
      { name: t("footer_4"), url: "/terms-of-use", exact: true },
      { name: t("footer_5"), url: "/privacy-policy" },
      { name: t("footer_6"), url: "/cookie-policy" },
    ],
    list3: [
      { name: t("footer_3"), url: "/how-it-works" },
      { name: t("footer_7"), url: "/how-it-works?to=faq" },
      { name: t("contact_us"), url: "/contact-us" },
    ],
  };

  if (IS_PS) {
    footerLists = {
      list1: [
        {
          name: t("footer_1"),
          url: "/about-us",
        },
        { name: t("footer_2"), url: "/information-portal?tab=articles" },
        // { name: t("footer_4"), url: "/terms-of-use", exact: true },
        // { name: t("footer_5"), url: "/privacy-policy" },
        // { name: t("footer_6"), url: "/cookie-policy" },
      ],
      list2: [],
      list3: [],
    };
  }

  const handleGoBack = () => navigateTo(-1);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  const themeButton = () => {
    return (
      <Icon
        name={theme === "light" ? "dark-mode-switch" : "light-mode"}
        size="lg"
        classes="page__theme-button"
        onClick={toggleTheme}
      />
    );
  };

  const hasPassedValidation = queryClient.getQueryData(["hasPassedValidation"]);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(
    !hasPassedValidation
  );
  const [passwordError, setPasswordError] = useState("");

  const validatePlatformPasswordMutation = useMutation(
    async (value) => {
      return await userSvc.validatePlatformPassword(value);
    },
    {
      onError: (error) => {
        const { message: errorMessage } = useError(error);
        setPasswordError(errorMessage);
      },
      onSuccess: () => {
        queryClient.setQueryData(["hasPassedValidation"], true);
        setIsPasswordModalOpen(false);
      },
    }
  );

  const handlePasswordCheck = (value) => {
    validatePlatformPasswordMutation.mutate(value);
  };

  return (
    <>
      <PasswordModal
        label={t("password")}
        btnLabel={t("submit")}
        isOpen={isPasswordModalOpen}
        error={passwordError}
        handleSubmit={handlePasswordCheck}
        isLoading={validatePlatformPasswordMutation.isLoading}
        placeholder={t("password_placeholder")}
      />
      <Navbar
        pages={pages}
        showCta
        showCountries={!IS_PS}
        languageLabel={t("language_label")}
        countryLabel={t("country_label")}
        buttonText={IS_PS ? null : t("button_text")}
        i18n={i18n}
        navigate={navigateTo}
        NavLink={NavLink}
        languages={langs}
        setLanguages={setLangs}
        countries={countries}
        initialLanguage={selectedLanguage}
        initialCountry={selectedCountry}
        setInitialCountry={setSelectedCountry}
        renderIn="website"
        hasThemeButton
        t={t}
        setIsPodcastsActive={setIsPodcastsActive}
        setIsVideosActive={setIsVideosActive}
      />
      <div
        className={[
          "page",
          `${additionalPadding ? "" : "page--no-additional-top-padding"}`,
          `${classNames(classes)}`,
        ].join(" ")}
      >
        {(heading || showGoBackArrow || headingButton) && (
          <div className="page__header">
            {showGoBackArrow && (
              <Icon
                classes="page__header-icon"
                name="arrow-chevron-back"
                size="md"
                color="#20809E"
                onClick={handleGoBack}
              />
            )}
            {heading && <h3 className="page__header-heading">{heading}</h3>}
            {headingButton && headingButton}
          </div>
        )}
        {children}
      </div>
      {themeButton()}
      {!IS_PS && (
        <CircleIconButton
          iconName="phone-emergency"
          classes="page__emergency-button"
          onClick={() => navigateTo(`/sos-center`)}
          label={t("emergency_button")}
        />
      )}
      <Footer
        showSocials={!IS_PS}
        lists={footerLists}
        navigate={navigateTo}
        Link={Link}
        renderIn="website"
      />
      <CookieBanner
        cookieState={cookieState}
        setCookieState={setCookieState}
        text={
          <Trans
            components={[
              <Link
                to={`/${localStorageLanguage}/cookie-policy`}
                className={
                  theme === "highContrast"
                    ? "page__cookie-policy-banner__link--hc"
                    : ""
                }
              />,
            ]}
          >
            {t("cookie_banner_text")}
          </Trans>
        }
        t={t}
      />
    </>
  );
};

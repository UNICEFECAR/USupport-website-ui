import React, { useState } from "react";
import { useNavigate, NavLink, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  Navbar,
  CircleIconButton,
  Footer,
  Icon,
} from "@USupport-components-library/src";
import { languageSvc, countrySvc } from "@USupport-components-library/services";
import { getCountryFromTimezone } from "@USupport-components-library/utils";
import classNames from "classnames";

import "./page.scss";
import { useEffect } from "react";

const kazakhstanCountry = {
  value: "KZ",
  label: "Kazakhstan",
  iconName: "KZ",
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
  const navigateTo = useNavigate();
  const { t, i18n } = useTranslation("page");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const localStorageCountry = localStorage.getItem("country");
  const localStorageLanguage = localStorage.getItem("language");
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorageLanguage ? { value: localStorageLanguage.toUpperCase() } : null
  );
  const [selectedCountry, setSelectedCountry] = useState();

  const fetchCountries = async () => {
    const res = await countrySvc.getActiveCountries();
    const usersCountry = getCountryFromTimezone();
    const validCountry = res.data.find((x) => x.alpha2 === usersCountry);
    let hasSetDefaultCountry = false;
    const countries = res.data.map((x) => {
      const countryObject = {
        value: x.alpha2,
        label: x.name,
        countryID: x["country_id"],
        iconName: x.alpha2,
      };

      if (localStorageCountry === x.alpha2) {
        setSelectedCountry(countryObject);
      } else if (!localStorageCountry) {
        if (validCountry?.alpha2 === x.alpha2) {
          hasSetDefaultCountry = true;
          localStorage.setItem("country", x.alpha2);
          setSelectedCountry(countryObject);
        }
      }

      return countryObject;
    });

    if (!hasSetDefaultCountry && !localStorageCountry) {
      localStorage.setItem("country", kazakhstanCountry.value);
      localStorage.setItem(
        "country_id",
        countries.find((x) => x.value === kazakhstanCountry.value).countryID
      );
    }

    return countries;
  };

  const fetchLanguages = async () => {
    const res = await languageSvc.getActiveLanguages();
    const languages = res.data.map((x) => {
      const languageObject = {
        value: x.alpha2,
        label: x.name,
        id: x["language_id"],
      };
      if (localStorageLanguage === x.alpha2) {
        setSelectedLanguage(languageObject);
        i18n.changeLanguage(localStorageLanguage);
      } else if (!localStorageLanguage) {
        localStorage.setItem("language", "en");
        i18n.changeLanguage("en");
      }
      return languageObject;
    });
    return languages;
  };

  const { data: countries } = useQuery(["countries"], fetchCountries);
  const { data: languages } = useQuery(["languages"], fetchLanguages);

  const pages = [
    { name: t("page_1"), url: "/", exact: true },
    { name: t("page_2"), url: "/how-it-works" },
    { name: t("page_3"), url: "/about-us" },
    { name: t("page_4"), url: "/information-portal" },
    { name: t("page_5"), url: "/contact-us" },
  ];

  const footerLists = {
    list1: [
      { name: t("footer_1"), url: "/about-us" },
      { name: t("footer_2"), url: "/information-portal" },
      { name: t("footer_3"), url: "/how-it-works" },
    ],
    list2: [
      { name: t("footer_4"), url: "/terms-of-use", exact: true },
      { name: t("footer_5"), url: "/privacy-policy" },
      { name: t("footer_6"), url: "/cookie-policy" },
    ],
    list3: [
      { value: "+7 717 232 28 78", iconName: "call-filled", onClick: "phone" },
      {
        value: `Beibitshilik St 10а, Astana 010000, Kazakhstan`,
        iconName: "pin",
      },
      {
        value: "usupport@7digit.io",
        iconName: "mail-filled",
        onClick: "mail",
      },
    ],
  };

  const handleGoBack = () => navigateTo(-1);

  return (
    <>
      <Navbar
        pages={pages}
        showCta
        showCountries
        languageLabel={t("language_label")}
        countryLabel={t("country_label")}
        buttonText={t("button_text")}
        i18n={i18n}
        navigate={navigateTo}
        NavLink={NavLink}
        languages={languages}
        countries={countries}
        initialLanguage={selectedLanguage}
        initialCountry={selectedCountry}
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
      <CircleIconButton
        iconName="phone-emergency"
        classes="page__emergency-button"
        onClick={() => navigateTo("/sos-center")}
        label={t("emergency_button")}
      />
      <Footer
        lists={footerLists}
        contactUsText={t("contact_us")}
        navigate={navigateTo}
        Link={Link}
      />
    </>
  );
};

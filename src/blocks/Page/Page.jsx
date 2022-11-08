import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Navbar,
  CircleIconButton,
  Footer,
} from "@USupport-components-library/src";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

import "./page.scss";

/**
 * Page
 *
 * Page wrapper
 *
 * @return {jsx}
 */
export const Page = ({ additionalPadding = true, classes, children }) => {
  const navigateTo = useNavigate();
  const { t, i18n } = useTranslation("page");
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
      { name: t("footer_4"), url: "/terms-of-service", exact: true },
      { name: t("footer_5"), url: "/privacy-policy" },
      { name: t("footer_6"), url: "/cookie-settings" },
    ],
    list3: [
      { value: "+359 888 888 888", iconName: "call-filled", onClick: "phone" },
      {
        value: `ul. "Oborishte" 5, ет. 3, 1504 Sofia `,
        iconName: "pin",
      },
      {
        value: "usupport@7digit.io",
        iconName: "mail-filled",
        onClick: "mail",
      },
    ],
  };

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
      />
      <div
        className={[
          "page",
          `${additionalPadding ? "" : "page--no-additional-top-padding"}`,
          `${classNames(classes)}`,
        ].join(" ")}
      >
        {children}
      </div>
      <CircleIconButton
        iconName="phone-emergency"
        classes="page__emergency-button"
        onClick={() => navigateTo("/sos-center")}
        label={t("emergency_button")}
      />
      <Footer lists={footerLists} contactUsText={t("contact_us")} />
    </>
  );
};

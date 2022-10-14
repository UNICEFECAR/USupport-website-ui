import React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, EmergencyButton } from "@USupport-components-library/src";
import { Footer } from "../Footer/Footer";
import classNames from "classnames";

import "./page.scss";
import { useTranslation } from "react-i18next";

/**
 * Page
 *
 * Page wrapper
 *
 * @return {jsx}
 */
export const Page = ({ additionalPadding = true, classes, children }) => {
  const navigateTo = useNavigate();
  const { t } = useTranslation("page");
  const pages = [
    { name: t("page_1"), url: "/", exact: true },
    { name: t("page_2"), url: "/how-it-works" },
    { name: t("page_3"), url: "/about-us" },
    // TODO: bring it back once the informaiton portal is ready
    // { name: "Information portal", url: "/information-portal" },
    { name: t("page_4"), url: "/contact-us" },
  ];

  // TODO: add the real countries & languages
  const countries = [
    {
      name: "Kazakhstan",
      flagName: "kazakhstan",
      languages: ["Kazakh", "Russian", "English"],
    },
    { name: "Germany", flagName: "germany", languages: ["German", "English"] },
    {
      name: "Switzerland",
      flagName: "swiss",
      languages: ["German", "French", "Italian", "Romansh"],
    },
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
      <Navbar pages={pages} countries={countries} />
      <div
        className={[
          "page",
          `${additionalPadding ? "" : "page--no-additional-top-padding"}`,
          `${classNames(classes)}`,
        ].join(" ")}
      >
        {children}
      </div>
      <EmergencyButton
        classes="page__emergency-button"
        onClick={() => navigateTo("/sos-center")}
      />
      <Footer lists={footerLists} />
    </>
  );
};

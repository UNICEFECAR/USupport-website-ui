import React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, EmergencyButton } from "/USupport-components-library/src";
import { Footer } from "../Footer/Footer";
import classNames from "classnames";

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

  const pages = [
    { name: "Home", url: "/", exact: true },
    { name: "How it works?", url: "/how-it-works" },
    { name: "About Us", url: "/about-us" },
    { name: "Information portal", url: "/information-portal" },
    { name: "Contact Us", url: "/contact-us" },
  ];

  // TODO: add the real countries & languages
  const countries = [
    {
      name: "Kazaakhstan",
      flagName: "kazakhstan",
      languages: ["Kazakh", "Russian", "English"],
    },
    {
      name: "Bulgaria",
      flagName: "bulgaria",
      languages: ["Bulgarian", "English"],
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
      { name: "About Us", url: "/about-us" },
      { name: "Information portal", url: "/information-portal" },
      { name: "How it works?", url: "/how-it-works" },
    ],
    list2: [
      { name: "Terms of Service", url: "/terms-of-service", exact: true },
      { name: "Privacy Policy", url: "/privacy-policy" },
      { name: "Cookie Settings", url: "/cookie-settings" },
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

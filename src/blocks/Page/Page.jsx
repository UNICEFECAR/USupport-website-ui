import React from "react";
import { Navbar, EmergencyButton } from "/USupport-components-library/src";
import "./page.scss";

/**
 * Page
 *
 * Page wrapper
 *
 * @return {jsx}
 */
export const Page = ({ children }) => {
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

  return (
    <>
      <Navbar pages={pages} countries={countries} />
      <div className="page">{children}</div>
      <EmergencyButton classes="page__emergency-button" />
    </>
  );
};

import React from "react";

import { Page, CustomAboutUs as CustomAboutUsBlock, ContactUs } from "#blocks";
import { RadialCircle } from "@USupport-components-library/src";

import "./custom-about-us.scss";

/**
 * CustomAboutUs
 *
 * Custom About us page
 *
 * @returns {JSX.Element}
 */
export const CustomAboutUs = () => {
  const IS_PS = localStorage.getItem("country") === "PS";
  return (
    <Page classes="page__custom-about-us">
      <CustomAboutUsBlock />
      {!IS_PS && <ContactUs />}
      <div className="page__about-us__radial-circle">
        <RadialCircle color="blue" />
      </div>
    </Page>
  );
};

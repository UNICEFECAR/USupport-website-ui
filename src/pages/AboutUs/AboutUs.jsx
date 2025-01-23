import React, { useContext, useEffect } from "react";
import { Page, WeHelp, OurPartners, ContactUs } from "#blocks";
import { RadialCircle } from "@USupport-components-library/src";
import { ThemeContext } from "@USupport-components-library/utils";

import "./about-us.scss";

/**
 * AboutUs
 *
 * About Us page.
 *
 * @returns {JSX.Element}
 */
export const AboutUs = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <Page
      classes={[
        "page__about-us",
        theme === "dark" ? "page__about-us--dark" : "",
      ].join(" ")}
    >
      <WeHelp />
      {/* <OurPartners /> */}
      <ContactUs />
      <div className="page__about-us__radial-circle">
        <RadialCircle color="blue" />
      </div>
    </Page>
  );
};

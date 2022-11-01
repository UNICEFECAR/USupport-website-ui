import React from "react";
import { Page, WeHelp, MeetOurSpecialists } from "#blocks";
import { RadialCircle } from "@USupport-components-library/src";

import "./about-us.scss";

/**
 * AboutUs
 *
 * About Us page.
 *
 * @returns {JSX.Element}
 */
export const AboutUs = () => {
  return (
    <Page classes="page__about-us">
      <WeHelp />
      <div className="page__about-us__radial-circle">
        <RadialCircle color="blue" />
      </div>
      <MeetOurSpecialists />
    </Page>
  );
};

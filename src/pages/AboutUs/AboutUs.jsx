import React from "react";
import { Page } from "../../blocks/Page/Page";
import { WeHelp } from "../../blocks/WeHelp";
import { MeetOurSpecialists } from "../../blocks/MeetOurSpecialists";
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

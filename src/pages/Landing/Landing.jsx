import React from "react";
import {
  Hero,
  FindYourself,
  HowItWorks,
  About,
  FAQ,
  DownloadApp,
  Page,
  InformationPortal,
  MeetOurProvidersOverview,
  OurPartnersOverview,
  MyQALanding,
  CouponInformation,
} from "#blocks";

import "./landing.scss";

/**
 * Landing
 *
 * Landing page
 *
 * @returns {JSX.Element}
 */
export function Landing() {
  return (
    <Page classes="page__landing">
      <Hero />
      <FindYourself />
      <About />
      <HowItWorks summary isTitleWhite={false} />
      <MeetOurProvidersOverview />
      {/* <OurPartnersOverview /> */}
      <InformationPortal />
      <MyQALanding />
      <CouponInformation />
      <FAQ showLearnMore={true} showMascot={true} showAll={false} />
      <DownloadApp />
    </Page>
  );
}

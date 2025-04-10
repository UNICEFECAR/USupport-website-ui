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
  // OurPartnersOverview,
  MyQALanding,
  CouponInformation,
} from "#blocks";

import { useEventListener } from "#hooks";

/**
 * Landing
 *
 * Landing page
 *
 * @returns {JSX.Element}
 */
export function Landing() {
  const [showCouponSection, setShowCouponSection] = React.useState(
    localStorage.getItem("country") !== "KZ"
  );

  useEventListener("countryChanged", () => {
    const country = localStorage.getItem("country");
    setShowCouponSection(country !== "KZ");
  });

  return (
    <Page>
      <Hero />
      <FindYourself />
      <About />
      <HowItWorks summary isTitleWhite={false} />
      <MeetOurProvidersOverview />
      {/* <OurPartnersOverview /> */}
      <InformationPortal />
      <MyQALanding />
      {showCouponSection ? <CouponInformation /> : null}
      <FAQ showLearnMore={true} showMascot={true} showAll={false} />
      <DownloadApp />
    </Page>
  );
}

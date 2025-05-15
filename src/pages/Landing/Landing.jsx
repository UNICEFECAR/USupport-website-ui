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
  const isGlobalOrRomania =
    localStorage.getItem("country") === "global" ||
    localStorage.getItem("country") === "RO";
  const [showCouponSection, setShowCouponSection] = React.useState(
    localStorage.getItem("country") !== "KZ"
  );
  const [showProvidersSection, setShowProvidersSection] = React.useState(
    !isGlobalOrRomania
  );

  useEventListener("countryChanged", () => {
    const country = localStorage.getItem("country");
    setShowCouponSection(country !== "KZ");
    setShowProvidersSection(!(country === "global" || country === "RO"));
  });

  return (
    <Page>
      <Hero />
      <FindYourself />
      <About />
      <HowItWorks summary isTitleWhite={false} />
      {showProvidersSection ? <MeetOurProvidersOverview /> : null}
      {/* <OurPartnersOverview /> */}
      <InformationPortal />
      <MyQALanding />
      {showCouponSection ? <CouponInformation /> : null}
      <FAQ showLearnMore={true} showMascot={true} showAll={false} />
      <DownloadApp />
    </Page>
  );
}

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
import { Navigate } from "react-router-dom";

/**
 * Landing
 *
 * Landing page
 *
 * @returns {JSX.Element}
 */
export function Landing() {
  const [showCouponSection, setShowCouponSection] = React.useState(
    localStorage.getItem("country") !== "KZ" &&
      localStorage.getItem("country") !== "RO",
  );
  const [showProvidersSection, setShowProvidersSection] =
    React.useState(localStorage.getItem("country") !== "RO");
  const [showMyQASection, setShowMyQASection] = React.useState(
    localStorage.getItem("country") !== "RO",
  );

  useEventListener("countryChanged", () => {
    const country = localStorage.getItem("country");
    setShowCouponSection(country !== "KZ");
    setShowProvidersSection(country !== "RO");
    setShowMyQASection(country !== "RO");
  });

  const IS_PS = localStorage.getItem("country") === "PS";

  if (IS_PS) {
    return (
      <Navigate
        to={`/${localStorage.getItem(
          "language",
        )}/information-portal?tab=articles`}
      />
    );
  }

  return (
    <Page>
      <Hero />
      <HowItWorks summary isTitleWhite={false} />
      {showProvidersSection ? <MeetOurProvidersOverview /> : null}
      <FindYourself />
      <FAQ showLearnMore={true} showMascot={true} showAll={false} />
      <InformationPortal />
      <About />
      {/* <OurPartnersOverview /> */}
      {showMyQASection ? <MyQALanding /> : null}
      {showCouponSection ? <CouponInformation /> : null}
      <DownloadApp />
    </Page>
  );
}

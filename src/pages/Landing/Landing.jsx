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
  const isGlobalOrRomania =
    localStorage.getItem("country") === "global" ||
    localStorage.getItem("country") === "RO";
  const [showCouponSection, setShowCouponSection] = React.useState(
    localStorage.getItem("country") !== "KZ" &&
      localStorage.getItem("country") !== "RO"
  );
  const [showProvidersSection, setShowProvidersSection] = React.useState(
    !isGlobalOrRomania
  );
  const [showMyQASection, setShowMyQASection] = React.useState(
    localStorage.getItem("country") !== "RO"
  );

  useEventListener("countryChanged", () => {
    const country = localStorage.getItem("country");
    setShowCouponSection(country !== "KZ");
    setShowProvidersSection(!(country === "global" || country === "RO"));
    setShowMyQASection(country !== "RO");
  });

  const IS_PS = localStorage.getItem("country") === "PS";

  if (IS_PS) {
    return (
      <Navigate
        to={`/${localStorage.getItem(
          "language"
        )}/information-portal?tab=articles`}
      />
    );
  }

  return (
    <Page>
      <Hero />
      <FindYourself />
      <About />
      <HowItWorks summary isTitleWhite={false} />
      {showProvidersSection ? <MeetOurProvidersOverview /> : null}
      {/* <OurPartnersOverview /> */}
      <InformationPortal />
      {showMyQASection ? <MyQALanding /> : null}
      {showCouponSection ? <CouponInformation /> : null}
      <FAQ showLearnMore={true} showMascot={true} showAll={false} />
      <DownloadApp />
    </Page>
  );
}

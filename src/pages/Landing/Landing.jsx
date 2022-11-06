import React from "react";
import {
  Hero,
  FindYourself,
  HowItWorks,
  About,
  FAQ,
  DownloadApp,
  Page,
} from "#blocks";

/**
 * Landing
 *
 * Landing page
 *
 * @returns {JSX.Element}
 */
export function Landing() {
  return (
    <Page>
      <Hero />
      <FindYourself />
      <About />
      <HowItWorks summary />
      <FAQ showLearnMore={true} showMascot={true} />
      <DownloadApp />
    </Page>
  );
}

import React from "react";
import { Hero } from "../../blocks/Hero";
import { FindYourself } from "../../blocks/FindYourself";
import { HowItWorks } from "../../blocks/HowItWorks";
import { About } from "../../blocks/About";
import { FAQ } from "../../blocks/FAQ";
import { DownloadApp } from "../../blocks/DownloadApp";
import { Page } from "../../blocks/Page/Page";

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
      <HowItWorks />
      <FAQ />
      <DownloadApp />
    </Page>
  );
}

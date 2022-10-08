import React from "react";
import { Hero } from "../../blocks/Hero";
import { FindYourself } from "../../blocks/FindYourself";
import { HowItWorks } from "../../blocks/HowItWorks";
import { About } from "../../blocks/About";
import { FAQ } from "../../blocks/FAQ";
import { DownloadApp } from "../../blocks/DownloadApp";

export function Landing() {
  return (
    <React.Fragment>
      <Hero />
      <FindYourself />
      <About />
      <HowItWorks />
      <FAQ />
      <DownloadApp />
    </React.Fragment>
  );
}

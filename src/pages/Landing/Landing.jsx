import React from "react";
import { Hero } from "../../blocks/Hero";
import { FindYourself } from "../../blocks/FindYourself";
import { HowItWorks } from "../../blocks/HowItWorks";
import { About } from "../../blocks/About";

export function Landing() {
  return (
    <React.Fragment>
      <Hero />
      <FindYourself />
      <HowItWorks />
      <About />
    </React.Fragment>
  );
}

import React from "react";
import { Hero } from "../../blocks/Hero";
import { HowItWorks } from "../../blocks/HowItWorks";
import { FindYourself } from "../../blocks/FindYourself";

export function Landing() {
  return (
    <React.Fragment>
      <Hero />
      <HowItWorks />
      <FindYourself />
    </React.Fragment>
  );
}

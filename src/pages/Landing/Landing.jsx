import React from "react";
import { Hero } from "../../blocks/Hero";
import { FindYourself } from "../../blocks/FindYourself";
import { HowItWorks } from "../../blocks/HowItWorks";

export function Landing() {
  return (
    <React.Fragment>
      <Hero />
      <FindYourself />
      <HowItWorks />
    </React.Fragment>
  );
}

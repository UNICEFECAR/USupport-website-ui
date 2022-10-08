import React from "react";
import { Hero } from "../../blocks/Hero";
import { FindYourself } from "../../blocks/FindYourself";
import { HowItWorks } from "../../blocks/HowItWorks";
import { ContactUs } from "../../blocks/ContactUs";

export function Landing() {
  return (
    <React.Fragment>
      <ContactUs />
      <Hero />
      <FindYourself />
      <HowItWorks />
    </React.Fragment>
  );
}

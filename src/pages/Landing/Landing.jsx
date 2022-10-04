import React from "react";
import FindYourself from "../../blocks/FindYourself/FindYourself";
import { LandingHero } from "../../blocks/LandingHero";

export default function Landing() {
  return (
    <React.Fragment>
      <LandingHero />
      <FindYourself />
    </React.Fragment>
  );
}

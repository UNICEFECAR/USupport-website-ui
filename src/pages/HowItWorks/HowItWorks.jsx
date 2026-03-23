import React, { useEffect, useRef } from "react";
import {
  Page,
  HowItWorksHero,
  MeetOurProviders,
  Question,
  FAQ,
  VideoTutorial,
  TakeAStep,
} from "#blocks";

import "./how-it-works.scss";

/**
 * HowItWorks
 *
 * How It Works page.
 *
 * @returns {JSX.Element}
 */
export const HowItWorks = () => {
  const faqRef = useRef();
  const providersBlockRef = useRef(null);

  const IS_RO = localStorage.getItem("country") === "RO";

  useEffect(() => {
    const to = new URLSearchParams(window.location.search).get("to");
    if (to === "faq") {
      faqRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
    if (to === "providers") {
      providersBlockRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <Page classes="page__how-it-works" showBackground>
      <HowItWorksHero />
      <div ref={providersBlockRef} />
      {!IS_RO ? <MeetOurProviders /> : null}
      <VideoTutorial />
      <div ref={faqRef} />
      <TakeAStep />
      <FAQ showLearnMore={false} showMascot hasBackground />
      <Question />
    </Page>
  );
};

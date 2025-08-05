import React, { useEffect, useRef } from "react";
import {
  Page,
  HowItWorks as HowItWorksBlock,
  MeetOurProviders,
  Question,
  FAQ,
  VideoTutorial,
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

  useEffect(() => {
    const to = new URLSearchParams(window.location.search).get("to");
    if (to === "faq") {
      faqRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <Page classes="page__how-it-works">
      <HowItWorksBlock showSummaryBellow={true} onPage={true} />
      <MeetOurProviders />
      <VideoTutorial />
      <div ref={faqRef} />
      <FAQ showLearnMore={false} showMascot={false} />
      <Question />
    </Page>
  );
};

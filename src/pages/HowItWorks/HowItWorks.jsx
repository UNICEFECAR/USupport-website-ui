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

const getNavbarHeight = () =>
  document.querySelector(".nav")?.offsetHeight ?? 96;

const scrollToSection = (element) => {
  const top =
    element.getBoundingClientRect().top + window.scrollY - getNavbarHeight();

  window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
};

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
    if (to !== "faq" && to !== "providers") return;

    const targetRef = to === "faq" ? faqRef : providersBlockRef;

    const timeoutId = window.setTimeout(() => {
      if (targetRef.current) {
        scrollToSection(targetRef.current);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <Page classes="page__how-it-works" showBackground>
      <HowItWorksHero />
      <div ref={providersBlockRef} />
      {!IS_RO ? <MeetOurProviders /> : null}
      <VideoTutorial />
      <TakeAStep />
      <div ref={faqRef} />
      <FAQ showLearnMore={false} showMascot hasBackground />
      <Question />
    </Page>
  );
};

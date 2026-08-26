import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Page,
  HowItWorksHero,
  MeetOurProviders,
  Question,
  FAQ,
  VideoTutorial,
  TakeAStep,
} from "#blocks";
import { useEventListener } from "#hooks";

import "./how-it-works.scss";

const getNavbarHeight = () =>
  document.querySelector(".nav")?.offsetHeight ?? 96;

const scrollToSection = (element) => {
  const top =
    element.getBoundingClientRect().top + window.scrollY - getNavbarHeight();

  window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

/**
 * HowItWorks
 *
 * How It Works page.
 *
 * @returns {JSX.Element}
 */
export const HowItWorks = () => {
  const [searchParams] = useSearchParams();
  const to = searchParams.get("to");
  const faqRef = useRef();
  const providersBlockRef = useRef(null);
  const hasMountedRef = useRef(false);

  const [isRo, setIsRo] = useState(localStorage.getItem("country") === "RO");

  useEventListener("countryChanged", () => {
    setIsRo(localStorage.getItem("country") === "RO");
  });

  const scrollToTarget = useCallback((target) => {
    if (target === "faq" && faqRef.current) {
      scrollToSection(faqRef.current);
      return;
    }

    if (target === "providers" && providersBlockRef.current) {
      scrollToSection(providersBlockRef.current);
      return;
    }

    scrollToTop();
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (to === "faq" || to === "providers") {
        scrollToTarget(to);
      } else if (hasMountedRef.current) {
        scrollToTarget(null);
      }
      hasMountedRef.current = true;
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [to, scrollToTarget]);

  useEventListener("how-it-works-nav", (event) => {
    scrollToTarget(event.detail);
  });

  return (
    <Page classes="page__how-it-works" showBackground>
      <HowItWorksHero />
      <div id="how-it-works-providers" ref={providersBlockRef} />
      {!isRo ? <MeetOurProviders /> : null}
      <VideoTutorial />
      <TakeAStep />
      <div id="how-it-works-faq" ref={faqRef} />
      <FAQ showLearnMore={false} showMascot hasBackground />
      <Question />
    </Page>
  );
};

import React from "react";
import {
  Page,
  HowItWorks as HowItWorksBlock,
  MeetOurProviders,
  Question,
  FAQ,
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
  return (
    <Page classes="page__how-it-works">
      <HowItWorksBlock showSummaryBellow={true} onPage={true} />
      <MeetOurProviders />
      <FAQ showLearnMore={false} showMascot={false} />
      <Question />
    </Page>
  );
};

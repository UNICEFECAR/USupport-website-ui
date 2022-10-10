import React from "react";
import { Page } from "../../blocks/Page/Page";
import { HowItWorks as HowItWorksBlock } from "../../blocks/HowItWorks/HowItWorks";
import { Question } from "../../blocks/Question/Question";
import {
  CollapsibleFAQ,
  Block,
  Grid,
  GridItem,
} from "usupport-components-library/src";

import "./how-it-works.scss";

/**
 * HowItWorks
 *
 * How It Works page.
 *
 * @returns {JSX.Element}
 */
export const HowItWorks = () => {
  const questions = [
    {
      heading: "Do I need to identify my mental problems by myself?",
      text: "Lorem ipsum odor amet, consectetuer adipiscing elit. Ac purus in massa egestas mollis varius dignissim elementum.",
    },
    {
      heading: "Can I pick my own therapists?",
      text: "Lorem ipsum odor amet, consectetuer adipiscing elit. Ac purus in massa egestas mollis varius dignissim elementum.",
    },
    {
      heading: "Do I need to prepare something before video consultations?",
      text: "Lorem ipsum odor amet, consectetuer adipiscing elit. Ac purus in massa egestas mollis varius dignissim elementum.",
    },
    {
      heading: "How do I get help?",
      text: "Download the app in AppStore for iOS or GooglePlay Store for Android. Download the app in AppStore for iOS or GooglePlay Store for Android. Download the app in AppStore for iOS or GooglePlay Store for Android. Download the app in AppStore for iOS or GooglePlay Store for Android.",
    },
  ];

  return (
    <Page classes="page__how-it-works">
      <HowItWorksBlock />
      <Block animation="fade-right">
        <Grid>
          <GridItem md={8} lg={12}>
            <h2>Frequently asked questions</h2>
          </GridItem>
          <GridItem md={8} lg={12} classes="page__how-it-works__faq-item">
            <CollapsibleFAQ questions={questions} />
          </GridItem>
        </Grid>
      </Block>
      <Question />
    </Page>
  );
};

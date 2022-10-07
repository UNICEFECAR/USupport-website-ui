import React from "react";
import {
  Block,
  Grid,
  GridItem,
  CollapsibleFAQ,
  Button,
  Line,
} from "/USupport-components-library/src";

import "./faq.scss";

import Mascot from "../../assets/MascotBroken.png";

/**
 * FAQ
 *
 * FAQ block
 *
 * @return {jsx}
 */
export const FAQ = () => {
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
      text: "Download the app in AppStore for iOS or GooglePlay Store for Android.",
    },
  ];

  const renderAllQuestions = () => {
    return questions.map((question, index) => {
      return (
        <>
          <CollapsibleFAQ question={question} key={index} />
          <Line />
        </>
      );
    });
  };

  return (
    <Block classes="faq">
      <Grid>
        <GridItem md={8} lg={12}>
          <h2>Frequently asked questions</h2>
        </GridItem>
        <GridItem md={8} lg={12}>
          <Grid>
            <GridItem md={5} lg={6}>
              <Grid classes="faq__content-item">
                <GridItem md={8} lg={12}>
                  {renderAllQuestions()}
                </GridItem>
                <GridItem md={8} lg={12}>
                  <Button
                    size="lg"
                    type="secondary"
                    label="Learn more"
                    classes={"faq__button"}
                  />
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem md={3} lg={6} classes="faq__mascot-item">
              <img src={Mascot} />
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
    </Block>
  );
};

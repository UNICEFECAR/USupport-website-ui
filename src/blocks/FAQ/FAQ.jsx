import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Block,
  Grid,
  GridItem,
  CollapsibleFAQ,
  Button,
} from "/USupport-components-library/src";
import PropTypes from "prop-types";

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
  const navigateTo = useNavigate();

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

  return (
    <Block classes="faq" animation="fade-right">
      <Grid>
        <GridItem md={8} lg={12}>
          <h2>Frequently asked questions</h2>
        </GridItem>
        <GridItem md={8} lg={12} classes="faq__content-item">
          <Grid>
            <GridItem md={6} lg={6}>
              <Grid>
                <GridItem md={8} lg={12}>
                  <CollapsibleFAQ questions={questions} />
                </GridItem>
                <GridItem md={8} lg={12} classes="faq__button-item">
                  <Button
                    size="lg"
                    type="secondary"
                    label="Learn more"
                    onClick={() => {
                      navigateTo("/about-us");
                    }}
                  />
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem md={2} lg={6} classes="faq__mascot-item">
              <img src={Mascot} />
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
    </Block>
  );
};

FAQ.propTypes = {
  /**
   * Array of questions
   * */
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      heading: PropTypes.string,
      text: PropTypes.string,
    })
  ).isRequired,
};

FAQ.defaultProps = {
  questions: [],
};

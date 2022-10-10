import React from "react";
import { Block, Grid, GridItem, Button } from "usupport-components-library/src";
import { useWindowDimensions } from "usupport-components-library/utils";

import "./question.scss";

/**
 * Question
 *
 * Question Block component
 *
 * @return {jsx}
 */
export const Question = () => {
  const { width } = useWindowDimensions();

  return (
    <Block classes="question" animation="fade-left">
      <Grid>
        <GridItem md={4} lg={6} classes="question__heading-item">
          <h3>Have a question?</h3>
          <p className="text">Don’t hesitate to contact us</p>
        </GridItem>
        <GridItem md={4} lg={6}>
          <Button
            label="Contact us"
            size={width > 768 ? "sm" : "lg"}
            web={width > 768}
            classes="question__button"
          />
        </GridItem>
      </Grid>
    </Block>
  );
};

import React from "react";
import {
  Block,
  Grid,
  GridItem,
  Button,
} from "/USupport-components-library/src";

import "./question.scss";
import useWindowDimensions from "../../../USupport-components-library/src/utils/useWindowDimensions";

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
    <Block classes="question">
      <Grid>
        <GridItem md={4} lg={6}>
          <h3>Have a question?</h3>
          <p className="text question__sub-heading">
            Don’t hesitate to contact us
          </p>
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

import React from "react";
import {
  Block,
  ContactForm,
  Grid,
  GridItem,
  RadialCircle,
} from "usupport-components-library/src";
import { useWindowDimensions } from "usupport-components-library/src/utils";

import "./contact-us.scss";

import mascot from "../../assets/MascotBlue.png";

/**
 * ContactUs
 *
 * Contact us block
 *
 * @return {jsx}
 */
export const ContactUs = () => {
  const { width } = useWindowDimensions();
  const showMascot = width >= 768;

  return (
    <Block classes="contact-us" animation="fade-down">
      <Grid classes="contact-us__main-grid">
        <GridItem md={8} lg={12} classes="contact-us__heading-item">
          <h2>Contact Us</h2>
        </GridItem>
        <GridItem md={8} lg={12}>
          <Grid classes="contact-us__secondary-grid">
            <GridItem md={8} classes="contact-us__subheading-item">
              <h4>Have a question? Don’t hesitate to contact us.</h4>
            </GridItem>
            <GridItem classes="contact-us__form-item" md={4} lg={8}>
              <ContactForm />
            </GridItem>
            {showMascot && (
              <GridItem md={4} lg={4} classes="contact-us__mascot-item">
                <img src={mascot} />
              </GridItem>
            )}
          </Grid>
        </GridItem>
      </Grid>
      <RadialCircle color="purple" />
      <RadialCircle color="blue" />
    </Block>
  );
};

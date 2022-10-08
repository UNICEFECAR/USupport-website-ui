import React from "react";
import {
  Block,
  ContactForm,
  Grid,
  GridItem,
} from "/USupport-components-library/src";

import { useWindowDimensions } from "/USupport-components-library/src/utils";
import mascot from "../../assets/MascotBlue.png";
import "./contact-us.scss";

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
    <Block classes="contact-us">
      <Grid classes="contact-us__main-grid">
        <GridItem md={8} lg={12} classes="contact-us__heading">
          <h2>Contact Us</h2>
        </GridItem>
        <GridItem md={8} lg={12}>
          <Grid classes="contact-us__secondary-grid">
            <GridItem md={8}>
              <h4 className="contact-us__subheading">
                Have a question? Don’t hesitate to contact us.
              </h4>
            </GridItem>
            <GridItem classes="contact-us__form-item" md={4} lg={8}>
              <ContactForm />
            </GridItem>
            {showMascot && (
              <GridItem md={4} lg={4} classes="contact-us__mascot-item">
                <img className="contact-us__mascot-item__image" src={mascot} />
              </GridItem>
            )}
          </Grid>
        </GridItem>
      </Grid>
    </Block>
  );
};

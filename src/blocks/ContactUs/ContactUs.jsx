import React from "react";
import {
  Block,
  ContactForm,
  Grid,
  GridItem,
  RadialCircle,
} from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/src/utils";

import "./contact-us.scss";

import mascot from "../../assets/MascotBlue.png";

import emailService from "../../services/emailService";

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

  const onServiceCall = async (data) => {
    return await emailService.send({
      subject: "New query",
      plainText: `Hello,\n\nYou have a new inquiry:\n\nEmail: ${data.email}\nReason: ${data.reason.label}\nmessage: ${data.message}\n\nRegards,\n IT department`,
      html: `<h3>Hello,</h3><p>You have a new inquiry</p><p>Email: ${data.email}</p><p>Reason: ${data.reason.label}<p><p>message: ${data.message}</p><p>Regards,</p><p>IT department<p>`,
    });
  };

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
              <ContactForm onServiceCall={onServiceCall} />
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

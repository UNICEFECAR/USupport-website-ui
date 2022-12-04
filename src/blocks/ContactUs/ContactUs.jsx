import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Block,
  ContactForm,
  Grid,
  GridItem,
  RadialCircle,
} from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/utils";
import { useTranslation } from "react-i18next";

import { emailSvc } from "@USupport-components-library/services";

import "./contact-us.scss";

import { mascotHappyBlue } from "@USupport-components-library/assets";

/**
 * ContactUs
 *
 * Contact us block
 *
 * @return {jsx}
 */
export const ContactUs = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("contact-us");
  const { width } = useWindowDimensions();
  const showMascot = width >= 768;

  const handleSendEmail = async (data) => {
    return await emailSvc.sendAdmin({
      subject: t("email_subject"),
      title: t("email_title"),
      text: t("email_text", {
        email: data.email,
        reason: data.reason,
        message: data.message,
      }),
    });
  };

  return (
    <Block classes="contact-us" animation="fade-down">
      <Grid classes="contact-us__main-grid">
        <GridItem md={8} lg={12} classes="contact-us__heading-item">
          <h2>{t("heading_1")}</h2>
        </GridItem>
        <GridItem md={8} lg={12}>
          <Grid classes="contact-us__secondary-grid">
            <GridItem md={8} classes="contact-us__subheading-item">
              <h4>{t("heading_2")}</h4>
            </GridItem>
            <GridItem classes="contact-us__form-item" md={4} lg={8}>
              <ContactForm
                sendEmail={handleSendEmail}
                navigate={navigate}
                t={t}
              />
            </GridItem>
            {showMascot && (
              <GridItem md={4} lg={4} classes="contact-us__mascot-item">
                <img src={mascotHappyBlue} />
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

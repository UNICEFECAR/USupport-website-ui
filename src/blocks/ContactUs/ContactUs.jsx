import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Block,
  ContactForm,
  Grid,
  GridItem,
  RadialCircle,
  Animation,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";

import { emailSvc } from "@USupport-components-library/services";

import "./contact-us.scss";

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
          <h2 className="contact-us__heading">{t("heading_1")}</h2>
        </GridItem>
        <GridItem md={8} lg={12}>
          <Grid classes="contact-us__secondary-grid">
            <GridItem classes="contact-us__form-item" md={4} lg={6}>
              <ContactForm
                classes="contact-us__form"
                sendEmail={handleSendEmail}
                navigate={navigate}
                t={t}
              />
            </GridItem>

            <GridItem md={4} lg={6} classes="contact-us__mascot-item">
              <Animation name="MascotBlueQuestions" />
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
      <RadialCircle color="purple" />
      <RadialCircle color="blue" />
    </Block>
  );
};

import React from "react";
import { Page, ContactUs as ContactUsBlock } from "#blocks";

import "./contact-us.scss";

/**
 * ContactUs
 *
 * Contact us page
 *
 * @returns {JSX.Element}
 */
export const ContactUs = () => {
  return (
    <Page classes="page__contact-us">
      <ContactUsBlock />
    </Page>
  );
};

import React from "react";
import { Page, PrivacyPolicy as PrivacyPolicyBlock } from "#blocks";

/**
 * PrivacyPolicy
 *
 * Privacy Policy Page
 *
 * @returns {JSX.Element}
 */
export const PrivacyPolicy = () => {
  return (
    <Page classes="page__privacy-policy">
      <PrivacyPolicyBlock />
    </Page>
  );
};

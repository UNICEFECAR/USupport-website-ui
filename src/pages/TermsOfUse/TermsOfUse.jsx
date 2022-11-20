import React from "react";
import { Page, TermsOfUse as TermsOfUseBlock } from "#blocks";

/**
 * TermsOfUse
 *
 * TermsOfUse Page
 *
 * @returns {JSX.Element}
 */
export const TermsOfUse = () => {
  return (
    <Page classes="page__terms-of-use">
      <TermsOfUseBlock />
    </Page>
  );
};

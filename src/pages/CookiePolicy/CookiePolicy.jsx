import React from "react";
import { Page, CookiePolicy as CookiePolicyBlock } from "#blocks";

/**
 * CookiePolicy
 *
 * CookiePolicy Page
 *
 * @returns {JSX.Element}
 */
export const CookiePolicy = () => {
  return (
    <Page classes="page__cookie-policy">
      <CookiePolicyBlock />
    </Page>
  );
};

import React from "react";
import { useTranslation } from "react-i18next";

import {
  CookiePolicy as CookiePolicyBlock,
  PrivacyPolicy as PrivacyPolicyBlock,
  TermsOfUse as TermsOfUseBlock,
} from "#blocks";

import { PhBackLink } from "../../components/PhBackLink/PhBackLink";
import { usePhPath } from "../../hooks/usePhPath";

import "./ph-legal.scss";

const PAGES = {
  "cookie-policy": {
    Block: CookiePolicyBlock,
    headingKey: "cookie-policy-page",
  },
  "privacy-policy": {
    Block: PrivacyPolicyBlock,
    headingKey: "privacy-policy-page",
  },
  "terms-of-use": { Block: TermsOfUseBlock, headingKey: "terms-of-use-page" },
};

/**
 * PhLegal
 *
 * Shows the existing CMS-driven legal pages inside the Play and Heal layout
 *
 * @param {string} page - "cookie-policy" | "privacy-policy" | "terms-of-use"
 * @returns {JSX.Element}
 */
export const PhLegal = ({ page }) => {
  const { t } = useTranslation("pages");
  const { t: tCommon } = useTranslation("playandheal", { keyPrefix: "common" });
  const toPath = usePhPath();
  const { Block, headingKey } = PAGES[page];

  return (
    <div className="ph__container ph__stack ph-legal">
      <div className="ph-page-top">
        <PhBackLink to={toPath("")}>{tCommon("back_to_home")}</PhBackLink>
        <h1 className="ph-legal__heading">{t(`${headingKey}.heading`)}</h1>
      </div>
      <div className="ph-legal__content">
        <Block />
      </div>
    </div>
  );
};

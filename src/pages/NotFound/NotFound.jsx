import React from "react";
import { Page, Question } from "#blocks";
import { NotFound as NotFoundBlock } from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";

/**
 * NotFound
 *
 * NotFound page.
 *
 * @returns {JSX.Element}
 */
export const NotFound = () => {
  const { t } = useTranslation("not-found-page");
  return (
    <Page>
      <NotFoundBlock
        headingText={t("heading")}
        subheadingText={t("subheading")}
        buttonText={t("button")}
      />
      <Question />
    </Page>
  );
};

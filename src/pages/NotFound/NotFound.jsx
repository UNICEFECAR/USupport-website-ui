import React from "react";
import { Page, Question } from "#blocks";
import { NotFound as NotFoundBlock } from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";

import "./not-found.scss";

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
      <div className="not-found-page__content-block">
        <NotFoundBlock
          headingText={t("heading")}
          subheadingText={t("subheading")}
          buttonText={t("button")}
        />
        <Question />
      </div>
    </Page>
  );
};

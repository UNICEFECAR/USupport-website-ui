import React from "react";
import { Page } from "../../blocks/Page/Page";
import { BlockNotFound } from "@USupport-components-library/src";
import { Question } from "../../blocks/Question/Question";

import "./not-found.scss";

/**
 * NotFound
 *
 * NotFound page.
 *
 * @returns {JSX.Element}
 */
export const NotFound = () => {
  return (
    <Page>
      <BlockNotFound />
      <Question />
    </Page>
  );
};

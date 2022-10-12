import React from "react";
import { Page } from "../../blocks/Page/Page";
import { NotFound as NotFoundBlock } from "@USupport-components-library/src";
import { Question } from "../../blocks/Question/Question";

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
      <NotFoundBlock />
      <Question />
    </Page>
  );
};

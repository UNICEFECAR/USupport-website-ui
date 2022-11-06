import React from "react";
import { SOSCenter as SOSCenterBlock, Question, Page } from "#blocks";

/**
 * SOSCenter page.
 *
 * @returns {JSX.Element}
 */
export const SOSCenter = () => {
  return (
    <Page>
      <SOSCenterBlock />
      <Question />
    </Page>
  );
};

import React from "react";
import { SOSCenter as SOSCenterBlock, Question, Page } from "#blocks";

/**
 * SOSCenter page.
 *
 * @returns {JSX.Element}
 */
export const SOSCenter = ({ contacts }) => {
  return (
    <Page>
      <SOSCenterBlock contacts={contacts} />
      <Question />
    </Page>
  );
};

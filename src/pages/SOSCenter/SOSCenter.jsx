import React from "react";
import { SOSCenter as SOSCenterBlock } from "../../blocks/SOSCenter/SOSCenter";
import { Question } from "../../blocks/Question/Question";

/**
 * SOSCenter page.
 *
 * @returns {JSX.Element}
 */
export const SOSCenter = ({ contacts }) => {
  return (
    <React.Fragment>
      <SOSCenterBlock contacts={contacts} />
      <Question />
    </React.Fragment>
  );
};

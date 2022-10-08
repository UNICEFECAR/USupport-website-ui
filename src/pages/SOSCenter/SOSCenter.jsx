import React from "react";

import "./soscenter.scss";
import { SOSCenter as SOSCenterBlock } from "../../blocks/SOSCenter/SOSCenter";
import { Question } from "../../blocks/Question/Question";

/**
 * SOSCenter page.
 *
 * @returns {JSX.Element}
 */
export const SOSCenter = () => {
  return (
    <React.Fragment>
      <SOSCenterBlock />
      <Question />
    </React.Fragment>
  );
};

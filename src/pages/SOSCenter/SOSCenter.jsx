import React from "react";
import { SOSCenter as SOSCenterBlock } from "../../blocks/SOSCenter/SOSCenter";
import { Question } from "../../blocks/Question/Question";

import "./sos-center.scss";

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

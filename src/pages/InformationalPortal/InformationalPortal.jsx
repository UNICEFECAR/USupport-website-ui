import React from "react";
import { Page } from "../../blocks/Page/Page";
import { Articles } from "../../blocks/Articles/Articles";

import "./informational-portal.scss";
export const InformationalPortal = ({}) => {
  return (
    <Page classes="page__informational-portal">
      <Articles />
    </Page>
  );
};

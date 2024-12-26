import React, { useContext } from "react";

import { Page, Articles } from "#blocks";
import { ThemeContext } from "@USupport-components-library/utils";

import "./information-portal.scss";

export const InformationPortal = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <Page
      classes={[
        "page__information-portal",
        theme === "dark" ? "page__information-portal--dark" : "",
      ].join(" ")}
    >
      <Articles />
    </Page>
  );
};

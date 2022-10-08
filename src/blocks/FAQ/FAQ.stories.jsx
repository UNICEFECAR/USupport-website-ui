import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { FAQ } from "./FAQ";

export default {
  title: "Website UI/blocks/FAQ",
  component: FAQ,
  argTypes: {},
};

const Template = () => (
  <Router>
    <FAQ />
  </Router>
);

export const Default = Template.bind({});
Default.args = {};

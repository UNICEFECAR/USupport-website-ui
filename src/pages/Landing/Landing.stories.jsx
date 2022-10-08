import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Landing } from "./Landing";

export default {
  title: "Website UI/pages/Landing",
  component: Landing,
  parameters: {
    layout: "fullscreen",
  },
};

const Template = () => (
  <Router>
    <Landing />
  </Router>
);

export const Default = Template.bind({});

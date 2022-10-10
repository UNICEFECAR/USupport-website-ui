import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { SOSCenter } from "./SOSCenter";

export default {
  title: "Website UI/pages/SOSCenter",
  component: SOSCenter,
  argTypes: {},
};

const contacts = ["+7 777 777 77 77", "+7 777 777 77 77", "+7 777 777 77 77"];

const Template = () => (
  <Router>
    <SOSCenter contacts={contacts} />
  </Router>
);

export const Default = Template.bind({});
Default.args = {};

import React from "react";
import { SOSCenter } from "./SOSCenter";

export default {
  title: "Website UI/pages/SOSCenter",
  component: SOSCenter,
  argTypes: {},
};

const contacts = ["+7 777 777 77 77", "+7 777 777 77 77", "+7 777 777 77 77"];

const Template = () => <SOSCenter contacts={contacts} />;

export const Default = Template.bind({});
Default.args = {};

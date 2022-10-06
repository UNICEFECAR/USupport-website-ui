import React from "react";

import { Hero } from "./Hero";

export default {
  title: "Website UI/blocks/Hero",
  component: Hero,
  argTypes: {},
};

const Template = (props) => <Hero {...props} />;

export const Default = Template.bind({});
Default.args = {};

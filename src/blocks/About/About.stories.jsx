import React from "react";

import About from "./About";

export default {
  title: "Website UI/Landing/About",
  component: About,
};

const Template = (args) => <About {...args} />;

export const Default = Template.bind({});
Default.args = {};

import React from "react";

import { About } from "./About";

export default {
  title: "Website UI/blocks/About",
  component: About,
};

const Template = (props) => <About {...props} />;

export const Default = Template.bind({});
Default.args = {};

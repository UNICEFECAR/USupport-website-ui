import React from "react";

import { Landing } from "./Landing";

export default {
  title: "Website UI/pages/Landing",
  component: Landing,
  parameters: {
    layout: "fullscreen",
  },
};

const Template = () => <Landing />;

export const Default = Template.bind({});

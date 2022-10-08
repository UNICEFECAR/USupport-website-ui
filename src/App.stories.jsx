import React from "react";

import App from "./App";

export default {
  title: "Website UI/App",
  component: App,
  parameters: {
    layout: "fullscreen",
  },
};

const Template = (props) => <App {...props} />;

export const Default = Template.bind({});

import React from "react";

import { ProviderOverview } from "./ProviderOverview";

export default {
  title: "Country Admin UI/blocks/ProviderOverview",
  component: ProviderOverview,
  argTypes: {},
};

const Template = (props) => <ProviderOverview {...props} />;

export const Default = Template.bind({});
Default.args = {};

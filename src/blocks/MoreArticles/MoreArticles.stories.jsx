import React from "react";

import { MoreArticles } from "./MoreArticles";

export default {
  title: "Website UI/blocks/MoreArticles",
  component: MoreArticles,
  argTypes: {},
};

const Template = (props) => <MoreArticles {...props} />;

export const Default = Template.bind({});
Default.args = {};

import React from 'react';

import { ArticleInformation } from './ArticleInformation';

export default {
  title: 'Website UI/blocks/ArticleInformation',
  component: ArticleInformation,
  argTypes: {},
};

const Template = (props) => <ArticleInformation {...props} />;

export const Default = Template.bind({});
Default.args = {};

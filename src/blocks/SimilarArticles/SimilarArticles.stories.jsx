import React from 'react';

import { SimilarArticles } from './SimilarArticles';

export default {
  title: 'Website UI/blocks/SimilarArticles',
  component: SimilarArticles,
  argTypes: {},
};

const Template = (props) => <SimilarArticles {...props} />;

export const Default = Template.bind({});
Default.args = {};

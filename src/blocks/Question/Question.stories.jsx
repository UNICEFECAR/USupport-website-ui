import React from 'react';

import { Question } from './Question';

export default {
  title: 'Website UI/blocks/Question',
  component: Question,
  argTypes: {},
};

const Template = (props) => <Question {...props} />;

export const Default = Template.bind({});
Default.args = {};

import React from 'react';

import { FAQ } from './FAQ';

export default {
  title: 'Website UI/blocks/FAQ',
  component: FAQ,
  argTypes: {},
};

const Template = (props) => <FAQ {...props} />;

export const Default = Template.bind({});
Default.args = {};

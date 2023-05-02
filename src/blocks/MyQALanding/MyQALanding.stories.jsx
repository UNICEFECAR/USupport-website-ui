import React from 'react';

import { MyQALanding } from './MyQALanding';

export default {
  title: 'Website UI/blocks/MyQALanding',
  component: MyQALanding,
  argTypes: {},
};

const Template = (props) => <MyQALanding {...props} />;

export const Default = Template.bind({});
Default.args = {};

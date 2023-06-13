import React from 'react';

import { CouponInformation } from './CouponInformation';

export default {
  title: 'Website UI/blocks/CouponInformation',
  component: CouponInformation,
  argTypes: {},
};

const Template = (props) => <CouponInformation {...props} />;

export const Default = Template.bind({});
Default.args = {};

import React from 'react';

import { HowItWorks } from './HowItWorks';

export default {
  title: 'Website UI/blocks/HowItWorks',
  component: HowItWorks,
  argTypes: {},
};

const Template = (props) => <HowItWorks {...props} />;

export const Default = Template.bind({});
Default.args = {};

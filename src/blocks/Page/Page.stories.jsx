import React from 'react';

import { Page } from './Page';

export default {
  title: 'Website UI/blocks/Page',
  component: Page,
  argTypes: {},
};

const Template = (props) => <Page {...props} />;

export const Default = Template.bind({});
Default.args = {};

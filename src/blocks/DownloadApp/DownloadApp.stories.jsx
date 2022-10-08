import React from 'react';

import { DownloadApp } from './DownloadApp';

export default {
  title: 'Website UI/blocks/DownloadApp',
  component: DownloadApp,
  argTypes: {},
};

const Template = (props) => <DownloadApp {...props} />;

export const Default = Template.bind({});
Default.args = {};

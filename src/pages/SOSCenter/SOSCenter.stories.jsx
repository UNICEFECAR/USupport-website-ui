import React from 'react';
import { SOSCenter } from './SOSCenter.jsx';

export default {
    title: 'Pages/SOSCenter',
    component: SOSCenter,
    argTypes: {},
};

const Template = (args) => <SOSCenter {...args} />;

export const Default = Template.bind({});
Default.args = {}; 

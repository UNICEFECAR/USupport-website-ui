import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { PrivacyPolicy } from './PrivacyPolicy';

export default {
    title: 'Website UI/pages/PrivacyPolicy',
    component: PrivacyPolicy,
    argTypes: {},
};

const Template = (props) => <Router><PrivacyPolicy {...props} /></Router>;

export const Default = Template.bind({});
Default.args = {}; 

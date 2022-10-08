import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { HowItWorks } from './HowItWorks';

export default {
    title: 'Website UI/pages/HowItWorks',
    component: HowItWorks,
    argTypes: {},
};

const Template = (props) => <Router><HowItWorks {...props} /></Router>;

export const Default = Template.bind({});
Default.args = {}; 

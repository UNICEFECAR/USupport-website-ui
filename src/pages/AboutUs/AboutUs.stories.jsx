import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AboutUs } from './AboutUs';

export default {
    title: 'Website UI/pages/AboutUs',
    component: AboutUs,
    argTypes: {},
};

const Template = (props) => <Router><AboutUs {...props} /></Router>;

export const Default = Template.bind({});
Default.args = {}; 

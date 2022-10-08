import React from "react";

import { Footer } from "./Footer";
import { BrowserRouter as Router } from "react-router-dom";

export default {
  title: "Website UI/blocks/Footer",
  component: Footer,
  argTypes: {},
};

const lists = {
  pagesList1: [
    { name: "About Us", url: "/about-us" },
    { name: "Information portal", url: "/information-portal" },
    { name: "How it works?", url: "/how-it-works" },
  ],
  pagesList2: [
    { name: "Terms of Service", url: "/terms-f-of-service", exact: true },
    { name: "Privacy Policy", url: "/privacy-policy" },
    { name: "Cookie Settings", url: "/cookie-settings" },
  ],
  pagesList3: [
    { value: "+359 888 888 888", iconName: "call-2", onClick: "phone" },
    {
      value: `ul. "Oborishte" 5, ет. 3, 1504 Sofia `,
      iconName: "pin",
      onClick: "",
    },
    { value: "Info@gigsremote.com", iconName: "mail-2", onClick: "mail" },
  ],
};
const Template = (props) => (
  <Router>
    <Footer {...props} />
  </Router>
);

export const Default = Template.bind({});
Default.args = {
  lists: lists,
};

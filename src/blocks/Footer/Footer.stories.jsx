import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { Footer } from "./Footer";

export default {
  title: "Website UI/blocks/Footer",
  component: Footer,
  argTypes: {},
};

const lists = {
  list1: [
    { name: "About Us", url: "/about-us" },
    { name: "Information portal", url: "/information-portal" },
    { name: "How it works?", url: "/how-it-works" },
  ],
  list2: [
    { name: "Terms of Service", url: "/terms-of-service", exact: true },
    { name: "Privacy Policy", url: "/privacy-policy" },
    { name: "Cookie Settings", url: "/cookie-settings" },
  ],
  list3: [
    { value: "+359 888 888 888", iconName: "call-filled", onClick: "phone" },
    {
      value: `ul. "Oborishte" 5, ет. 3, 1504 Sofia `,
      iconName: "pin",
    },
    { value: "usupport@7digit.io", iconName: "mail-filled", onClick: "mail" },
  ],
};

const Template = () => (
  <Router>
    <Footer lists={lists} />
  </Router>
);

export const Default = Template.bind({});
Default.args = {};

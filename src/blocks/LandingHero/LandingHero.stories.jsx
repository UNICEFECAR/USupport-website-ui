import React from "react";

import LandingHero from "./LandingHero";

export default {
  title: "Website UI/Landing/LandingHero",
  component: LandingHero,
};

const Template = (args) => <LandingHero {...args} />;

export const Default = Template.bind({});
Default.args = {};

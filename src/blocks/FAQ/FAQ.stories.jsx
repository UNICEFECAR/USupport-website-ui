import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { FAQ } from "./FAQ";

export default {
  title: "Website UI/blocks/FAQ",
  component: FAQ,
  argTypes: {},
};

// Create a react-query client
const queryClient = new QueryClient();

const Template = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <FAQ />
    </Router>
  </QueryClientProvider>
);

export const Default = Template.bind({});
Default.args = {};

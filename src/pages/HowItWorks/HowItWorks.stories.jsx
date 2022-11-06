import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HowItWorks } from "./HowItWorks";

export default {
  title: "Website UI/pages/HowItWorks",
  component: HowItWorks,
  argTypes: {},
};

// Create a react-query client
const queryClient = new QueryClient();

const Template = (props) => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <HowItWorks {...props} />
    </Router>
  </QueryClientProvider>
);

export const Default = Template.bind({});
Default.args = {};

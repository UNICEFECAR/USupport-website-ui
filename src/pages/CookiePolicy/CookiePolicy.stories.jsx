import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router } from "react-router-dom";
import { CookiePolicy } from "./CookiePolicy";

export default {
  title: "Website UI/pages/CookiePolicy",
  component: CookiePolicy,
  argTypes: {},
};

// Create a react-query client
const queryClient = new QueryClient();

const Template = (props) => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <CookiePolicy {...props} />
    </Router>
  </QueryClientProvider>
);

export const Default = Template.bind({});
Default.args = {};

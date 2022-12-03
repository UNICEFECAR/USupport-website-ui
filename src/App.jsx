import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Landing,
  SOSCenter,
  ContactUs,
  HowItWorks,
  NotFound,
  AboutUs,
  InformationPortal,
  ArticleInformation,
  PrivacyPolicy,
  CookiePolicy,
  TermsOfUse,
  ProviderOverview,
} from "#pages";

// AOS imports
import "aos/dist/aos.css";
import AOS from "aos";

import "./App.scss";

// Create a react-query client
const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

function App() {
  AOS.init({
    offset: 10,
    duration: 1000,
    easing: "ease-in-sine",
    delay: 300,
    anchorPlacement: "top-bottom",
    once: false,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/provider" element={<ProviderOverview />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/information-portal" element={<InformationPortal />} />
          <Route
            path="/information-portal/article/:id"
            element={<ArticleInformation />}
          />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/sos-center" element={<SOSCenter />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <ReactQueryDevtools initialOpen />
    </QueryClientProvider>
  );
}

export default App;

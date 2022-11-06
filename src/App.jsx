import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/information-portal" element={<InformationPortal />} />
          <Route path="/article/:id" element={<ArticleInformation />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/sos-center" element={<SOSCenter />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

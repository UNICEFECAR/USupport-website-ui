import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useWebPSupportCheck } from "react-use-webp-support-check";
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
  MyQA,
} from "#pages";
import { ThemeContext } from "@USupport-components-library/utils";

// AOS imports
import "aos/dist/aos.css";
import AOS from "aos";

import "./App.scss";

// Create a react-query client
const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

function App() {
  const supportsWebP = useWebPSupportCheck();
  document.body.classList.add(`${supportsWebP ? "webp" : "no-webp"}`);

  AOS.init({
    offset: 10,
    duration: 1000,
    easing: "ease-in-sine",
    delay: 300,
    anchorPlacement: "top-bottom",
    once: false,
  });

  const getDefaultTheme = () => {
    const localStorageTheme = localStorage.getItem("default-theme");
    return localStorageTheme || "light";
  };

  const [theme, setTheme] = useState(getDefaultTheme());

  useEffect(() => {
    localStorage.setItem("default-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`theme-${theme}`}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/about-us/provider" element={<ProviderOverview />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route
                path="/information-portal"
                element={<InformationPortal />}
              />
              <Route
                path="/information-portal/article/:id"
                element={<ArticleInformation />}
              />
              <Route path="/my-qa" element={<MyQA />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/sos-center" element={<SOSCenter />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/terms-of-use" element={<TermsOfUse />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <ReactQueryDevtools initialOpen />
        </QueryClientProvider>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;

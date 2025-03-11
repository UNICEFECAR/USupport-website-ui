import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
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
  CustomAboutUs,
} from "#pages";
import { ThemeContext } from "@USupport-components-library/utils";
import { userSvc } from "@USupport-components-library/services";

import { useEventListener } from "#hooks";

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
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const lang = localStorage.getItem("language");
    if (!lang) {
      localStorage.setItem("language", "en");
    }
    setShowContent(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("default-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`theme-${theme}`}>
        <QueryClientProvider client={queryClient}>
          {showContent && <Root />}
          <ReactQueryDevtools initialOpen />
        </QueryClientProvider>
      </div>
    </ThemeContext.Provider>
  );
}

const Root = () => {
  const [country, setCountry] = useState(
    localStorage.getItem("country") || null
  );
  const [hasAddedPlatformAccess, setHasAddedPlatformAccess] = useState(false);

  const handler = useCallback(() => {
    const country = localStorage.getItem("country");
    if (country) {
      setCountry(country);
    }
  }, []);

  useEventListener("countryChanged", handler);

  useQuery({
    queryKey: ["addPlatformAccess", country],
    queryFn: async () => {
      await userSvc.addPlatformAccess("website");
      setHasAddedPlatformAccess(true);
    },
    enabled: !!country && !hasAddedPlatformAccess,
  });
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        {/* <Route path="/about-us" element={<AboutUs />} /> */}
        <Route path="/about-us/:country" element={<CustomAboutUs />} />
        <Route path="/about-us/provider" element={<ProviderOverview />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/information-portal" element={<InformationPortal />} />
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
  );
};

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { SOSCenter } from "./pages/SOSCenter";
import { ContactUs } from "./pages/ContactUs";
import { HowItWorks } from "./pages/HowItWorks";
import { NotFound } from "./pages/NotFound";
import { AboutUs } from "./pages/AboutUs/AboutUs";

import "./App.scss";

// AOS imports
import "aos/dist/aos.css";
import AOS from "aos";

function App() {
  // TODO: add the country specific information about the SOS center
  const contacts = [
    {
      title:
        "Do you feel like you can’t wait for the registration process and you need special and immediate help? Here are some of our hotlines to talk to our specialists. They are available 24/7 to help.",
      phone: "+7 888 888 888",
    },
    {
      title:
        "Do you feel like you can’t wait for the registration process and you need special and immediate help? Here are some of our hotlines to talk to our specialists. They are available 24/7 to help.",
      link: "https://staging.7digit.io",
    },
    {
      title:
        "Do you feel like you can’t wait for the registration process and you need special and immediate help? Here are some of our hotlines to talk to our specialists. They are available 24/7 to help.",
      link: "https://staging.7digit.io",
    },
    {
      title:
        "Do you feel like you can’t wait for the registration process and you need special and immediate help? Here are some of our hotlines to talk to our specialists. They are available 24/7 to help.",
      link: "https://staging.7digit.io",
    },
  ];

  AOS.init({
    offset: 10,
    duration: 1000,
    easing: "ease-in-sine",
    delay: 300,
    anchorPlacement: "top-bottom",
    once: false,
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/sos-center" element={<SOSCenter contacts={contacts} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

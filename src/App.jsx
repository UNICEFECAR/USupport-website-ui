import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { SOSCenter } from "./pages/SOSCenter";
import { ContactUs } from "./pages/ContactUs";
import { HowItWorks } from "./pages/HowItWorks";
import { NotFound } from "./pages/NotFound";

import "./App.scss";

// AOS imports
import "aos/dist/aos.css";
import AOS from "aos";

function App() {
  const contacts = ["+7 777 777 77 77", "+7 777 777 77 77", "+7 777 777 77 77"];

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
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/sos-center" element={<SOSCenter contacts={contacts} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

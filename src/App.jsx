import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { SOSCenter } from "./pages/SOSCenter";
import { ContactUs } from "./pages/ContactUs";
import { HowItWorks } from "./pages/HowItWorks";
import { NotFound } from "./pages/NotFound";

import "./App.scss";

function App() {
  const contacts = ["+7 777 777 77 77", "+7 777 777 77 77", "+7 777 777 77 77"];

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

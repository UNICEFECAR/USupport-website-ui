import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "/USupport-components-library/src";
import { Landing } from "./pages/Landing";
import { SOSCenter } from "./pages/SOSCenter";

import "./App.scss";

function App() {
  const pages = [
    { name: "Home", url: "/", exact: true },
    { name: "How it works?", url: "/how-it-works" },
    { name: "About Us", url: "/about-us" },
    { name: "Information portal", url: "/information-portal" },
    { name: "Contact Us", url: "/contact-us" },
  ];

  // TODO: add the real countries & languages
  const countries = [
    {
      name: "Kazaakhstan",
      flagName: "kazakhstan",
      languages: ["Kazakh", "Russian", "English"],
    },
    {
      name: "Bulgaria",
      flagName: "bulgaria",
      languages: ["Bulgarian", "English"],
    },
    { name: "Germany", flagName: "germany", languages: ["German", "English"] },
    {
      name: "Switzerland",
      flagName: "swiss",
      languages: ["German", "French", "Italian", "Romansh"],
    },
  ];

  return (
    <Router>
      <Navbar pages={pages} countries={countries} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/sos-center" element={<SOSCenter />} />
      </Routes>
    </Router>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "/USupport-components-library/src";
import { Landing } from "./pages/Landing";
import { Footer } from "./blocks/Footer/Footer";

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

  const footerLists = {
    pagesList1: [
      { name: "About Us", url: "/about-us" },
      { name: "Information portal", url: "/information-portal" },
      { name: "How it works?", url: "/how-it-works" },
    ],
    pagesList2: [
      { name: "Terms of Service", url: "/terms-f-of-service", exact: true },
      { name: "Privacy Policy", url: "/privacy-policy" },
      { name: "Cookie Settings", url: "/cookie-settings" },
    ],
    pagesList3: [
      { value: "+359 888 888 888", iconName: "call-2", onClick: "phone" },
      {
        value: `ul. "Oborishte" 5, ет. 3, 1504 Sofia `,
        iconName: "pin",
        onClick: "",
      },
      { value: "Info@gigsremote.com", iconName: "mail-2", onClick: "mail" },
    ],
  };

  return (
    <Router>
      <Navbar pages={pages} countries={countries} />
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
      <Footer lists={footerLists} />
    </Router>
  );
}

export default App;

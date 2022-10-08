import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "/USupport-components-library/src";
import { Footer } from "./blocks/Footer/Footer";
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

  const footerLists = {
    list1: [
      { name: "About Us", url: "/about-us" },
      { name: "Information portal", url: "/information-portal" },
      { name: "How it works?", url: "/how-it-works" },
    ],
    list2: [
      { name: "Terms of Service", url: "/terms-of-service", exact: true },
      { name: "Privacy Policy", url: "/privacy-policy" },
      { name: "Cookie Settings", url: "/cookie-settings" },
    ],
    list3: [
      { value: "+359 888 888 888", iconName: "call-filled", onClick: "phone" },
      {
        value: `ul. "Oborishte" 5, ет. 3, 1504 Sofia `,
        iconName: "pin",
      },
      {
        value: "usupport@7digit.io",
        iconName: "mail-filled",
        onClick: "mail",
      },
    ],
  };

  const contacts = ["+7 777 777 77 77", "+7 777 777 77 77", "+7 777 777 77 77"];

  return (
    <Router>
      <Navbar pages={pages} countries={countries} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/sos-center" element={<SOSCenter contacts={contacts} />} />
      </Routes>
      <Footer lists={footerLists} />
    </Router>
  );
}

export default App;

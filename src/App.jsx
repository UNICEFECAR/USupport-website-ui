import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { SOSCenter } from "./pages/SOSCenter";
import { NotFound } from "./pages/NotFound";

import "./App.scss";

function App() {
  const contacts = ["+7 777 777 77 77", "+7 777 777 77 77", "+7 777 777 77 77"];

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/sos-center" element={<SOSCenter contacts={contacts} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

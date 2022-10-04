import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Root from "./Root";

import "./App.scss";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<Root />} />
      </Routes>
    </Router>
  );
}

export default App;

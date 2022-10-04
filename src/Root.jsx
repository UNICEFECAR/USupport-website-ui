import React from "react";
import { Route, Routes } from "react-router-dom";
import { Landing } from "./pages/Landing";

export default function Root() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
    </Routes>
  );
}

export { Root };

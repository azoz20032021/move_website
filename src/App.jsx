import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import MovieDetail from "./MovieDetail";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movie/:id" element={<MovieDetail />} />
    </Routes>
  );
}

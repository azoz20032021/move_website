import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Popular from "./Popular";
import Top from "./Top";
import MovieDetail from "./MovieDetail";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Popular" element={<Popular />} />
      <Route path="/Top" element={<Top />} />
      <Route path="/movie/:id" element={<MovieDetail />} />
      <Route path="/Popular/:id" element={<MovieDetail />} />
    </Routes>
  );
}

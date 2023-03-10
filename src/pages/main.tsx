import React from "react";
import ReactDOM from "react-dom/client";
import { Routes, Route } from "react-router-dom";

import Editor from "./editor";
import Home from "./home";
const Main = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/editor" element={<Editor />}></Route>
    </Routes>
  );
};

export default Main;

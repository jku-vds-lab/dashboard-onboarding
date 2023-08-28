import React from "react";
import ReactDOM from "react-dom/client";
import { Routes, Route } from "react-router-dom";

import Editor from "./editor";
import Home from "./home";
import UserLevel from "../UI/output-pane/userLevel";
const Main = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/editor" element={<Editor />}></Route>
      <Route path="/userLevel" element={<UserLevel />}></Route>
    </Routes>
  );
};

export default Main;

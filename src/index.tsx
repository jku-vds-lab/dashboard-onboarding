// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { BrowserRouter } from "react-router-dom";
import "./UI/assets/css/index.scss";
import "./onboarding/css/onboarding.scss";
import "./UI/assets/css/dashboard.scss";
import "./UI/assets/css/flow.scss";
import "./App.css";

// createRoot(document.getElementById('root')!).render(
//   <BrowserRouter>
//     <App />
//   </BrowserRouter>
// );

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

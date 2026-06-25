import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "@/App.jsx";
import "@/styles/index.css";
import { initSnappyFill } from "@/lib/snappyFill.js";

// Snappy pointer-following fill for opt-in CTA buttons.
initSnappyFill();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

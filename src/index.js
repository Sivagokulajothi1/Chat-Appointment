import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import { ToastProvider } from "./context/ToastContext";
import ToastContainer from "./components/Toast/ToastContainer";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ToastProvider>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <ToastContainer />
      </AuthProvider>
    </BrowserRouter>
  </ToastProvider>
);

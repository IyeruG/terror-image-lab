import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>
);

// Cache the app shell so it can be opened offline after the first successful visit.
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/terror-image-lab/sw.js", {
      scope: "/terror-image-lab/"
    }).catch((error) => console.warn("No se pudo activar el modo sin conexión:", error));
  });
}
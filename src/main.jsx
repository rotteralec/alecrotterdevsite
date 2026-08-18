// main.jsx — the entry point of the app.
// index.html loads this file which boots react.

import React from "react";
import ReactDOM from "react-dom/client";
//Import app.jsx to be rendered below
import App from "./App.jsx";

// CSS bundled here by vite
// base.css = shared resets, terminal.css / minimal.css = one per layout.
import "./styles/base.css";
import "./styles/terminal.css";
import "./styles/minimal.css";

//Render app into empty <div id="root"> in index.html
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

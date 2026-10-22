import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import Landing from "./Landing";
import "./index.css";
import "./theme-refresh.css"; // delete this line if you did not add theme-refresh.css

// The landing page is shown first. The dashboard lives at the "#app" address,
// so the browser Back button returns from the dashboard to the landing page.
function Root() {
  const [showDashboard, setShowDashboard] = useState(() => window.location.hash === "#app");

  useEffect(() => {
    const onHashChange = () => {
      setShowDashboard(window.location.hash === "#app");
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  function openDashboard() {
    window.location.hash = "app";
  }

  return showDashboard ? <App /> : <Landing onStart={openDashboard} />;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);

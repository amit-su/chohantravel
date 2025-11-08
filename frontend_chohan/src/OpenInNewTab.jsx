import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OpenInNewTab({ to }) {
  const navigate = useNavigate();

  useEffect(() => {
    const newTab = window.open(to, "_blank");
    newTab.focus();
    navigate("/", { replace: true }); // Optionally navigate back or do something else
  }, [to, navigate]);

  return null; // Since it's just for redirecting, no UI is needed
}

export default OpenInNewTab;

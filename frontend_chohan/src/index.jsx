import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import axios from "axios";
import { Provider } from "react-redux";
import "react-toastify/dist/ReactToastify.css";

// import store from "./redux/root";
import store from "./redux/rtk/app/store";
const root = ReactDOM.createRoot(document.getElementById("root"));

axios.defaults.baseURL = import.meta.env.VITE_APP_API;

// APP VERSION CHECK
const appVersion = import.meta.env.VITE_APP_VERSION;

axios.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("access-token");
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  config.headers["X-App-Version"] = appVersion;
  return config;
});

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

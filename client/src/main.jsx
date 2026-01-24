import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { HashRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
// import { CssBaseline } from "@mui/material";

import "./assets/scss/atelierware.scss";
import "./assets/scss/style-email.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Provider store={store}>
    <HashRouter>
      <PersistGate loading={null} persistor={persistor}>
        {/* <CssBaseline /> */}
        <App />
      </PersistGate>
    </HashRouter>
  </Provider>
  // </React.StrictMode>
);

/** @format */

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./store";

// Render cho root chính
const rootElement = document.getElementById("root");
if (rootElement) {
   const root = ReactDOM.createRoot(rootElement);
   root.render(
      <Provider store={store.storePopup}>
         <React.StrictMode>
            <App />
         </React.StrictMode>
      </Provider>
   );
}

reportWebVitals();

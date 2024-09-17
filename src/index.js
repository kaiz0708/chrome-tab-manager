/** @format */

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./store";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Render cho root chính
const rootElement = document.getElementById("root");
if (rootElement) {
   const root = ReactDOM.createRoot(rootElement);
   root.render(
      <Provider store={store.storePopup}>
         <DndProvider backend={HTML5Backend}>
            <React.StrictMode>
               <App />
            </React.StrictMode>
         </DndProvider>
      </Provider>
   );
}

reportWebVitals();

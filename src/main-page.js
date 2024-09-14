/** @format */
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./store";
import MainPage from "./components/page/MainPage";

const mainRootElement = document.getElementById("main-root");
if (mainRootElement) {
   const root2 = ReactDOM.createRoot(mainRootElement);
   root2.render(
      <Provider store={store}>
         <React.StrictMode>
            <MainPage />
         </React.StrictMode>
      </Provider>
   );
}

reportWebVitals();

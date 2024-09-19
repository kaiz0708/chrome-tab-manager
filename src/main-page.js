/** @format */
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import MainPage from "./components/page/MainPage";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import store from "./store";

const mainRootElement = document.getElementById("main-root");
if (mainRootElement) {
   const root2 = ReactDOM.createRoot(mainRootElement);
   root2.render(
      <Provider store={store.storeMainPage}>
         <DndProvider backend={HTML5Backend}>
            <React.StrictMode>
               <MainPage />
            </React.StrictMode>
         </DndProvider>
      </Provider>
   );
}

reportWebVitals();

/** @format */

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./store";
import { SnackbarProvider } from "notistack";
import { MaterialDesignContent } from "notistack";
import { styled, width } from "@mui/system";

const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
   "&.notistack-MuiContent-success": {
      backgroundColor: "#ffffff",
      color: "#2D7738",
      boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;",
   },
   "&.notistack-MuiContent-error": {
      backgroundColor: "#ffffff",
      color: "#970C0C",
      boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;",
   },
}));

const rootElement = document.getElementById("root");
if (rootElement) {
   const root = ReactDOM.createRoot(rootElement);
   root.render(
      <Provider store={store.storePopup}>
         <SnackbarProvider
            anchorOrigin={{
               vertical: "top",
               horizontal: "right",
            }}
            Components={{
               success: StyledMaterialDesignContent,
               error: StyledMaterialDesignContent,
            }}
            maxSnack={3}>
            <React.StrictMode>
               <App />
            </React.StrictMode>
         </SnackbarProvider>
      </Provider>
   );
}

reportWebVitals();

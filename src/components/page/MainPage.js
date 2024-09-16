/** @format */
import React, { useEffect, useRef, useState } from "react";
import NavBar from "./NavBar";
import Collections from "./Collections";
import ListTabMainPage from "./ListTabMainPage";
import { updateWindowCurrent } from "../../store/features/popupSlices";
import { useSelector, useDispatch } from "react-redux";
import { Grid2 } from "@mui/material";
import {
   deleteTab,
   addEmptyTab,
   deleteWindow,
   setValue,
   addWindow,
   moveTabAroundWindow,
   moveTabWithoutWindow,
   activeTab,
   navigateTab,
   pinTab,
} from "../../store/features/windowSlices";

/* global chrome */

function MainPage() {
   const windowTabs = useSelector((state) => state.window.value);
   const typeDisplay = process.env.REACT_APP_TYPE_TAB_BLOCK;
   const dispatch = useDispatch();
   useEffect(() => {
      chrome.storage.local.get("reduxState", (result) => {
         if (result.reduxState) {
            dispatch(setValue(result.reduxState));
         }
      });

      chrome.storage.local.get("windowCurrent", (result) => {
         if (result.windowCurrent) {
            dispatch(updateWindowCurrent(result.windowCurrent));
         }
      });
   }, []);

   return (
      <div>
         <Grid2
            columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
            container
            spacing={1}>
            <Grid2 size={{ xs: 3, sm: 3, md: 3, lg: 3, xl: 3 }}>
               <NavBar />
            </Grid2>

            <Grid2 size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
               <Collections />
            </Grid2>

            <Grid2 size={{ xs: 3, sm: 3, md: 3, lg: 3, xl: 3 }}>
               <ListTabMainPage window={{ windowTabs, typeDisplay }} />
            </Grid2>
         </Grid2>
      </div>
   );
}

export default MainPage;

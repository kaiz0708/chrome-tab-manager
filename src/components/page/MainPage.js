/** @format */
import React, { useEffect, useRef, useState } from "react";
import NavBar from "./NavBar";
import Collections from "./Collections";
import ListTabMainPage from "./ListTabMainPage";
import { updateWindowCurrent } from "../../store/features/popupSlices";
import { useSelector, useDispatch } from "react-redux";
import { Grid2 } from "@mui/material";
import { ActionTab } from "../../enums/ActionTab";
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
} from "../../store/features/windowCopy";

/* global chrome */

function MainPage() {
   const typeDisplay = ActionTab.typeBlock;
   const windowTabs = useSelector((state) => state.main.value);
   const dispatch = useDispatch();

   useEffect(() => {
      chrome.windows.getCurrent({ populate: true }, (currentWindow) => {
         dispatch(updateWindowCurrent(currentWindow.id));
         chrome.windows.getAll({ populate: true }, (windows) => {
            const sortedWindows = windows.sort((a, b) => {
               if (a.id === currentWindow.id) return -1;
               if (b.id === currentWindow.id) return 1;
               return 0;
            });

            dispatch(setValue(sortedWindows));
         });
      });
   }, []);

   useEffect(() => {
      const handleMessage = (msg) => {
         switch (msg.type) {
            case ActionTab.typeDeleteTabChrome:
               dispatch(deleteTab(msg.data.tabId));
               break;
            case ActionTab.typeAddTabChrome:
               dispatch(addEmptyTab(msg.data));
               break;
            case ActionTab.typeCloseWindowChrome:
               dispatch(deleteWindow(msg.data.windowId));
               break;
            case ActionTab.typeOpenWindow:
               dispatch(addWindow(msg.data.window));
               break;
            case ActionTab.typeMoveTabAroundWindow:
               dispatch(moveTabAroundWindow(msg.data));
               break;
            case ActionTab.typeMoveTabWithOutWindow:
               dispatch(moveTabWithoutWindow(msg.data));
               break;
            case ActionTab.typeActiveTab:
               dispatch(activeTab(msg.data));
               break;
            case ActionTab.typeNavigateTab:
               dispatch(navigateTab(msg.data));
               break;
            case ActionTab.typePinTab:
               dispatch(pinTab(msg.data));
               break;
         }
      };

      chrome.runtime.onMessage.addListener(handleMessage);
      return () => {
         chrome.runtime.onMessage.removeListener(handleMessage);
      };
   }, []);

   return (
      <div className='h-screen'>
         <Grid2
            height={"100%"}
            columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
            container
            spacing={1}>
            <Grid2 size={{ xs: 3, sm: 3, md: 3, lg: 3, xl: 3 }}>
               <NavBar />
            </Grid2>

            <Grid2 size={{ xs: 7, sm: 7, md: 7, lg: 7, xl: 7 }}>
               <Collections />
            </Grid2>

            <Grid2 size={{ xs: 2, sm: 2, md: 2, lg: 2, xl: 2 }}>
               <ListTabMainPage window={{ windowTabs, typeDisplay }} />
            </Grid2>
         </Grid2>
      </div>
   );
}

export default MainPage;

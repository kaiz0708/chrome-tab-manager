/** @format */

import React, { useEffect, useRef } from "react";
import WindowTab from "./WindowTab";
import { useSelector, useDispatch } from "react-redux";
import { updateWindowCurrent } from "../../store/features/popupSlices";
import TaskBarPopup from "./TaskBarPopup";
import { Grid2 } from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
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
} from "../../store/features/windowSlices";
/* global chrome */
function Popup() {
   const windowTabs = useSelector((state) => state.window.value);
   const typeDisplay = useSelector((state) => state.current.displayState);
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
               console.log("move around");
               console.log(msg.data);
               dispatch(moveTabAroundWindow(msg.data));
               break;
            case ActionTab.typeMoveTabWithOutWindow:
               console.log("move without");
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

   const moveMainPageExtension = () => {
      const url = chrome.runtime.getURL("main-page.html");
      window.open(url);
   };

   return (
      <div className='w-full font-sans text-xs font-normal text-custom-black'>
         <div>
            <h1 className='text-2xl p-2 font-normal text-custom-color-title text-center'>
               Chrome Tab Manager
            </h1>

            <button
               onClick={(e) => {
                  moveMainPageExtension();
               }}>
               Go to Another Page
            </button>
         </div>

         <div className='p-2 h-custom bg-gray-100 '>
            <DndProvider backend={HTML5Backend}>
               <Grid2
                  columns={
                     typeDisplay === ActionTab.typeTabHori
                        ? { xs: 3, sm: 3, md: 3 }
                        : { xs: 2, sm: 2, md: 2 }
                  }
                  container
                  spacing={1}>
                  {windowTabs.map((windowTab, index) => (
                     <Grid2 size={{ xs: 1, sm: 1, md: 1 }} key={index}>
                        <WindowTab
                           window={{
                              windowTab,
                              index,
                              typeDisplay: typeDisplay,
                           }}
                        />
                     </Grid2>
                  ))}
               </Grid2>
            </DndProvider>
         </div>

         <div className='p-2'>
            <TaskBarPopup />
         </div>
      </div>
   );
}

export default Popup;

/** @format */

import React, { useEffect, useRef } from "react";
import WindowTab from "./components/popup/WindowTab";
import { useSelector, useDispatch } from "react-redux";
import { updateWindowCurrent } from "./store/features/popupSlices";
import TaskBarPopup from "./components/popup/TaskBarPopup";
import { Grid2 } from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
   deleteTab,
   addEmptyTab,
   deleteWindow,
   setValue,
   addWindow,
} from "./store/features/windowSlices";
/* global chrome */
function App() {
   const windowTabs = useSelector((state) => state.window.value);
   const typeAddTabChrome = process.env.REACT_APP_TYPE_MESSAGE_ADD_TAB_CHROME;
   const typeDeleteTabChrome =
      process.env.REACT_APP_TYPE_MESSAGE_DELETE_TAB_CHROME;
   const typeCloseWindowChrome =
      process.env.REACT_APP_TYPE_MESSAGE_CLOSE_WINDOW_CHROME;
   const typeOpenWindow = process.env.REACT_APP_TYPE_MESSAGE_OPEN_WINDOW_CHROME;
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
            case typeDeleteTabChrome:
               dispatch(deleteTab(msg.data.tabId));
               break;
            case typeAddTabChrome:
               dispatch(addEmptyTab(msg.data));
               break;
            case typeCloseWindowChrome:
               dispatch(deleteWindow(msg.data.windowId));
               break;
            case typeOpenWindow:
               console.log(msg.data.window);
               dispatch(addWindow(msg.data.window));
               break;
         }
      };

      chrome.runtime.onMessage.addListener(handleMessage);
      return () => {
         chrome.runtime.onMessage.removeListener(handleMessage);
      };
   }, []);

   return (
      <div className='w-full space-y-3 font-sans text-xs font-normal text-custom-black'>
         <div>
            <h1 className='text-2xl p-2 font-normal mb-4 text-custom-color-title text-center'>
               Chrome Tab Manager
            </h1>
         </div>

         <div className='p-2 h-custom bg-gray-100 '>
            <DndProvider backend={HTML5Backend}>
               <Grid2 columns={{ xs: 3, sm: 3, md: 3 }} container spacing={1}>
                  {windowTabs.map((windowTab, index) => (
                     <Grid2 size={{ xs: 1, sm: 1, md: 1 }} key={index}>
                        <WindowTab window={{ windowTab, index }} />
                     </Grid2>
                  ))}
               </Grid2>
            </DndProvider>
         </div>
         <div>
            <TaskBarPopup />
         </div>
      </div>
   );
}

export default App;

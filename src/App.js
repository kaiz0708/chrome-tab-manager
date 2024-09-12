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
   moveTabAroundWindow,
   moveTabWithoutWindow,
   activeTab,
   navigateTab,
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
   const typeMoveTabAroundWindow =
      process.env.REACT_APP_TYPE_MESSAGE_MOVE_TAB_AROUND_WINDOW_CHROME;
   const typeMoveTabWithOutWindow =
      process.env.REACT_APP_TYPE_MESSAGE_MOVE_TAB_WITHOUT_WINDOW_CHROME;
   const typeDisplay = useSelector((state) => state.current.displayState);
   const typeActiveTab = process.env.REACT_APP_TYPE_MESSAGE_ACTIVE_TAB;
   const typeNavigateTab = process.env.REACT_APP_TYPE_MESSAGE_NEVIGATE_URL;
   const typeBlock = process.env.REACT_APP_TYPE_TAB_BLOCK;
   const typeTabHori = process.env.REACT_APP_TYPE_TAB_HORIZONTAL;
   const dispatch = useDispatch();

   useEffect(() => {
      chrome.windows.getCurrent({ populate: true }, (currentWindow) => {
         dispatch(updateWindowCurrent(currentWindow.id));
         chrome.windows.getAll({ populate: true }, (windows) => {
            console.log(windows);
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
               dispatch(addWindow(msg.data.window));
               break;
            case typeMoveTabAroundWindow:
               dispatch(moveTabAroundWindow(msg.data));
               break;
            case typeMoveTabWithOutWindow:
               dispatch(moveTabWithoutWindow(msg.data));
               break;
            case typeActiveTab:
               dispatch(activeTab(msg.data));
               break;
            case typeNavigateTab:
               dispatch(navigateTab(msg.data));
               break;
         }
      };

      chrome.runtime.onMessage.addListener(handleMessage);
      return () => {
         chrome.runtime.onMessage.removeListener(handleMessage);
      };
   }, []);

   return (
      <div className='w-full font-sans text-xs font-normal text-custom-black'>
         <div>
            <h1 className='text-2xl p-2 font-normal text-custom-color-title text-center'>
               Chrome Tab Manager
            </h1>
         </div>

         <div className='p-2 h-custom bg-gray-100 '>
            <DndProvider backend={HTML5Backend}>
               <Grid2
                  columns={
                     typeDisplay === typeTabHori
                        ? { xs: 3, sm: 3, md: 3 }
                        : { xs: 3, sm: 3, md: 3 }
                  }
                  container
                  spacing={1}>
                  {windowTabs.map((windowTab, index) => (
                     <Grid2 size={{ xs: 1, sm: 1, md: 1 }} key={index}>
                        <WindowTab window={{ windowTab, index }} />
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

export default App;

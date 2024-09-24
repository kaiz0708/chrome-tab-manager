/** @format */

import React, { useEffect, useRef, useState, lazy } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateWindowCurrent } from "../../store/features/popupSlices";
import { ActionTab } from "../../enums/ActionTab";
import serviceChrome from "../services/ServiceChrome";
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
const Header = lazy(() => import("./header/Header"));
const MainPopup = lazy(() => import("./main/MainPopup"));
const TaskBarPopup = lazy(() => import("./footer/TaskBarPopup"));
/* global chrome */
function Popup() {
   const windowTabs = useSelector((state) => state.window.value);
   const [windowList, setWindowList] = useState([]);
   const typeDisplay = useSelector((state) => state.current.displayState);
   const dispatch = useDispatch();

   useEffect(() => {
      setWindowList(windowTabs);
   }, [windowTabs]);

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

   const filterGroupTab = (value) => {
      if (value === "") {
         setWindowList(windowTabs);
      } else {
         const windowGroup = windowTabs.map((window) => {
            const filteredTabs = window.tabs.filter((e) =>
               e.title.toLowerCase().includes(value.toLowerCase())
            );
            return { ...window, tabs: filteredTabs };
         });
         setWindowList(windowGroup);
      }
   };

   const groupTab = () => {
      let urls = [];
      windowList.forEach((window) => {
         window.tabs.forEach((tab) => {
            urls.push(tab);
         });
      });
      serviceChrome.openWindowGroup(urls);
   };

   return (
      <div className='w-full scrollbar-thumb-rounded font-sans text-xs font-normal text-custom-black'>
         <Header />

         <MainPopup windowTabs={windowList} typeDisplay={typeDisplay} />

         <TaskBarPopup filterGroupTab={filterGroupTab} groupTab={groupTab} />
      </div>
   );
}

export default Popup;

/** @format */

import React, { useEffect, useRef, useState, lazy } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addNoti, updateWindowCurrent } from "../../store/features/popupSlices";
import { ActionTab } from "../../enums/action";
import serviceChrome from "../services/ServiceChrome";
import {
   deleteTab,
   setValueCollection,
   addCollectionItem,
   addEmptyTab,
   deleteWindow,
   setValue,
   addWindow,
   moveTabAroundWindow,
   moveTabWithoutWindow,
   activeTab,
   navigateTab,
   pinTab,
   deleteCollectionItem,
   createCollection,
   deleteCollection,
   updateCollection,
} from "../../store/features/windowSlices";
import { updateStateDisplay } from "../../store/features/popupSlices";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { v4 as uuidv4 } from "uuid";
const Header = lazy(() => import("./header/Header"));
const MainPopup = lazy(() => import("./main/popup/MainPopup"));
const TaskBarPopup = lazy(() => import("./footer/TaskBarPopup"));
/* global chrome */
function Popup() {
   const windowTabs = useSelector((state) => state.window.value);
   const [windowList, setWindowList] = useState([]);
   const typeDisplay = useSelector((state) => state.current.displayState);
   const dispatch = useDispatch();
   const [loading, setLoading] = useState(true);

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

      serviceChrome.createState();
      chrome.storage.local.get([process.env.REACT_APP_TYPE_NAME_VIEW_VARIABLE], (result) => {
         dispatch(updateStateDisplay(result[process.env.REACT_APP_TYPE_NAME_VIEW_VARIABLE]));
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
            case ActionTab.typeAddItemCollection:
               console.log(msg.data);
               dispatch(addCollectionItem(msg.data));
               break;
            case ActionTab.typeDeleteItemCollection:
               dispatch(deleteCollectionItem(msg.data));
               break;
            case ActionTab.typeCreateCollection:
               dispatch(createCollection(msg.data));
               break;
            case ActionTab.typeDeleteCollection:
               dispatch(deleteCollection(msg.data));
               break;
            case ActionTab.typeUpdateCollection:
               dispatch(updateCollection(msg.data));
               break;
            case ActionTab.typeChangeState:
               const { display } = msg.data;
               console.log(display);
               serviceChrome.setStateLocal(process.env.REACT_APP_TYPE_NAME_VIEW_VARIABLE, display);
               dispatch(updateStateDisplay(display));
               break;
         }
      };

      chrome.runtime.onMessage.addListener(handleMessage);
      return () => {
         chrome.runtime.onMessage.removeListener(handleMessage);
      };
   }, []);

   const removeVietnameseTones = (str) => {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
   };

   const normalizeSearchValue = (value) => {
      return value.trim().replace(/\s+/g, " ");
   };

   const filterGroupTab = (value) => {
      const normalizedInput = normalizeSearchValue(value);

      if (normalizedInput === "") {
         setWindowList(windowTabs);
      } else {
         const normalizedValue = removeVietnameseTones(normalizedInput.toLowerCase());
         console.log(normalizedValue);
         const windowGroup = windowTabs.map((window) => {
            const filteredTabs = window.tabs.filter((e) => removeVietnameseTones(e.title.toLowerCase()).includes(normalizedValue));
            return { ...window, tabs: filteredTabs };
         });
         setWindowList(windowGroup);
      }
   };

   const groupTab = () => {
      let urls = [];
      if (windowList.length === 0) {
         dispatch(addNoti({ message: "Nothing title match", id: uuidv4(), status: 400 }));
      } else {
         windowList.forEach((window) => {
            window.tabs.forEach((tab) => {
               urls.push(tab);
            });
         });
         serviceChrome.openWindowGroup(urls);
         dispatch(addNoti({ message: "Group tab success", id: uuidv4(), status: 200 }));
      }
   };

   return (
      <div className='w-full scrollbar-thumb-rounded font-sans text-xs font-normal text-custom-black'>
         <Header />

         <DndProvider backend={HTML5Backend}>
            <MainPopup windowTabs={windowList} typeDisplay={typeDisplay} loadingCollection={loading} />
         </DndProvider>

         <TaskBarPopup filterGroupTab={filterGroupTab} groupTab={groupTab} />
      </div>
   );
}

export default Popup;

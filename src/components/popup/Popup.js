/** @format */

import React, { useEffect, useRef, useState, lazy } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateWindowCurrent } from "../../store/features/popupSlices";
import { ActionTab } from "../../enums/ActionTab";
import serviceChrome from "../services/ServiceChrome";
import { deleteTab, setValueCollection, addCollectionItem, addEmptyTab, deleteWindow, setValue, addWindow, moveTabAroundWindow, moveTabWithoutWindow, activeTab, navigateTab, pinTab, deleteCollectionItem } from "../../store/features/windowSlices";
import { updateStateDisplay } from "../../store/features/popupSlices";
import utils from "../../common/utils";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
const Header = lazy(() => import("./header/Header"));
const MainPopup = lazy(() => import("./main/MainPopup"));
const TaskBarPopup = lazy(() => import("./footer/TaskBarPopup"));
/* global chrome */
function Popup() {
   const windowTabs = useSelector((state) => state.window.value);
   const [windowList, setWindowList] = useState([]);
   const typeDisplay = useSelector((state) => state.current.displayState);
   const dispatch = useDispatch();
   const [loading, setLoading] = useState(true);

   const getStorageSync = (key) => {
      return new Promise((resolve, reject) => {
         chrome.storage.sync.get(key, (result) => {
            if (chrome.runtime.lastError) {
               return reject(chrome.runtime.lastError);
            }
            resolve(result);
         });
      });
   };

   async function getUrl(amountUrl, urls) {
      const promises = [];

      for (let i = 0; i < amountUrl; i++) {
         const urlString = process.env.REACT_APP_TYPE_NAME_URL_VARIABLE + i;
         promises.push(getStorageSync(urlString));
      }

      const results = await Promise.all(promises);
      results.forEach((result, i) => {
         const urlString = process.env.REACT_APP_TYPE_NAME_URL_VARIABLE + i;
         if (result[urlString] !== "") {
            if (i !== 0) {
               urls = urls + ":::" + result[urlString];
            } else {
               urls = urls + result[urlString];
            }
         }
      });

      return urls;
   }

   const fetchData = () => {
      let fieldNamesMain = ["id", "name", "date"];
      let fieldNamesUrl = ["id", "url", "title", "favIconUrl"];
      chrome.storage.local.get(process.env.REACT_APP_TYPE_NAME_INFORBASE_VARIABLE, function (result) {
         const res = utils.parseStringToObjects(result[process.env.REACT_APP_TYPE_NAME_INFORBASE_VARIABLE], ":::", ";", fieldNamesMain);

         chrome.storage.local.get(process.env.REACT_APP_TYPE_NAME_URL_VARIABLE, function (result) {
            const resUrl = utils.parseStringToObjects(result[process.env.REACT_APP_TYPE_NAME_URL_VARIABLE], ":::", ";", fieldNamesUrl);
            let combined = utils.combineObjectsToTabs(res, resUrl, "id");
            dispatch(setValueCollection(combined));
            setLoading(false);
         });
      });
   };

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

      serviceChrome.setStateLocal("inforBase", "0;Test;27/09/2024");
      serviceChrome.setStateLocal(
         "url_collection",
         "0;https://www.youtube.com/;(97) YouTube;https://www.youtube.com/s/desktop/6e5f8289/img/favicon_32x32.png:::1;https://www.youtube.com/;(97) YouTube;https://www.youtube.com/s/desktop/6e5f8289/img/favicon_32x32.png"
      );

      chrome.storage.local.get([process.env.REACT_APP_TYPE_NAME_VIEW_VARIABLE], (result) => {
         dispatch(updateStateDisplay(result[process.env.REACT_APP_TYPE_NAME_VIEW_VARIABLE]));
      });
      fetchData();
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
               console.log(msg.data);
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
            case ActionTab.typeAddCollection:
               dispatch(addCollectionItem(msg.data));
               break;
            case ActionTab.typeDeleteCollection:
               dispatch(deleteCollectionItem(msg.data));
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
            const filteredTabs = window.tabs.filter((e) => e.title.toLowerCase().includes(value.toLowerCase()));
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

         <DndProvider backend={HTML5Backend}>
            <MainPopup windowTabs={windowList} typeDisplay={typeDisplay} loadingCollection={loading} />
         </DndProvider>

         <TaskBarPopup filterGroupTab={filterGroupTab} groupTab={groupTab} />
      </div>
   );
}

export default Popup;

/** @format */
import Tab from "./Tab";
import { useDrag, useDrop } from "react-dnd";
import React, { useRef, lazy } from "react";
import serviceChrome from "../../../services/ServiceChrome";
import { HiOutlinePlus } from "react-icons/hi2";
import { Tooltip, Zoom } from "@mui/material";
import { Grid2 } from "@mui/material";
import { ActionTab } from "../../../../enums/action";
import { useDispatch, useSelector } from "react-redux";
import { addCollectionItem, deleteCollectionItem } from "../../../../store/features/windowSlices";
import { addNoti, updateAuth } from "../../../../store/features/popupSlices";
import { v4 as uuidv4 } from "uuid";
import servicePopup from "../../servicePopup";
/* global chrome */

function ListTab({ window }) {
   const dropRef = useRef(null);
   const tabType = process.env.REACT_APP_TYPE_TAB;
   const collectionType = process.env.REACT_APP_TYPE_COLLECTION;
   const dispatch = useDispatch();
   const [{ isOver }, drop] = useDrop({
      accept: "ITEM",
      drop: async (item, monitor) => {
         const tabId = item.tab.id;
         const clientOffset = monitor.getClientOffset();
         const hoverIndex = calculateHoverIndex(clientOffset, dropRef, window.windowTab.tabs, process.env.REACT_APP_TYPE_AMOUNT_COLUMNS_TAB, window.typeDisplay);

         if (item.display === tabType) {
            if (window.typeFeature === tabType) {
               serviceChrome.moveTab(tabId, hoverIndex, window.windowTab.id);
            } else {
               const collectionId = window.windowTab.id;
               const response = await servicePopup.addTabToCollection(item.tab, collectionId, hoverIndex);
               if (response === null) {
                  dispatch(updateAuth(false));
                  dispatch(addNoti({ message: "Session expire, please login again", id: uuidv4(), status: 401 }));
               } else {
                  const { data, status, message } = response.data;
                  serviceChrome.sendMessage({ id: collectionId, tab: data, newPosition: hoverIndex }, ActionTab.typeAddItemCollection);
                  dispatch(addCollectionItem({ id: collectionId, tab: data, newPosition: hoverIndex }));
                  dispatch(addNoti({ message, id: uuidv4(), status }));
                  serviceChrome.closeTab(tabId, item.tab.windowId);
               }
            }
         } else {
            if (window.typeFeature === collectionType) {
               const collectionId = window.windowTab.id;
               const response = await servicePopup.moveItemCollectionToOther(item.tab, collectionId, hoverIndex);
               if (response === null) {
                  dispatch(updateAuth(false));
                  dispatch(addNoti({ message: "Session expire, please login again", id: uuidv4(), status: 401 }));
               } else {
                  const { data, status, message } = response.data;
                  serviceChrome.sendMessage({ idCollection: item.tab.collection, tab: item.tab }, ActionTab.typeDeleteItemCollection);
                  serviceChrome.sendMessage({ id: collectionId, tab: data, newPosition: hoverIndex }, ActionTab.typeAddItemCollection);
                  dispatch(deleteCollectionItem({ idCollection: item.tab.collection, tab: item.tab }));
                  dispatch(addCollectionItem({ id: collectionId, tab: data, newPosition: hoverIndex }));
                  dispatch(addNoti({ message, id: uuidv4(), status }));
               }
            } else {
               const collectionId = item.tab.collection;
               const response = await servicePopup.deleteTabToCollection(item.tab, collectionId);
               if (response === null) {
                  dispatch(updateAuth(false));
                  dispatch(addNoti({ message: "Session expire, please login again", id: uuidv4(), status: 401 }));
               } else {
                  const { data, status, message } = response.data;
                  serviceChrome.openNewTabEmpty(window.windowTab.id, data.url, false);
                  serviceChrome.sendMessage({ idCollection: collectionId, tab: data }, ActionTab.typeDeleteItemCollection);
                  dispatch(deleteCollectionItem({ idCollection: collectionId, tab: data }));
                  dispatch(addNoti({ message, id: uuidv4(), status }));
               }
            }
         }
      },
      collect: (monitor) => ({
         isOver: !!monitor.isOver(),
      }),
   });

   const calculateHoverIndex = (clientOffset, dropRef, tabs, columns, typeDisplay) => {
      const containerRect = dropRef.current.getBoundingClientRect();

      if (typeDisplay === ActionTab.typeBlock) {
         const { top: containerTop, height: containerHeight } = containerRect;
         const relativeY = clientOffset.y - containerTop;
         const averageTabHeight = containerHeight / tabs.length;
         let hoverIndex = Math.round(relativeY / averageTabHeight);
         if (hoverIndex < 0 || hoverIndex >= tabs.length) {
            return -1;
         }
         hoverIndex = Math.max(0, Math.min(hoverIndex, tabs.length - 1));
         return hoverIndex;
      }

      if (typeDisplay === ActionTab.typeTabHori) {
         const { left: containerLeft, top: containerTop, width: containerWidth, height: containerHeight } = containerRect;
         const relativeX = clientOffset.x - containerLeft;
         const relativeY = clientOffset.y - containerTop;
         const averageTabWidth = containerWidth / columns;
         const averageTabHeight = containerHeight / Math.ceil(tabs.length / columns);

         const columnIndex = Math.floor(relativeX / averageTabWidth);
         const rowIndex = Math.floor(relativeY / averageTabHeight);
         let hoverIndex = rowIndex * columns + columnIndex;
         if (columnIndex < 0 || columnIndex >= columns || rowIndex < 0 || hoverIndex >= tabs.length) {
            return -1;
         }
         hoverIndex = Math.max(0, Math.min(hoverIndex, tabs.length - 1));
         if (hoverIndex >= tabs.length) {
            return -1;
         }

         return hoverIndex;
      }
   };

   const combinedRef = (el) => {
      dropRef.current = el;
      drop(el);
   };

   const addNewEmptyTab = (windowId) => {
      serviceChrome.openNewTabEmpty(windowId, "chrome://newtab", false);
   };

   return (
      <div ref={combinedRef}>
         {window.windowTab.tabs.length === 0 ? (
            <div className='cursor-pointer border-dashed h-10 border-1 flex justify-center items-center p-2 rounded hover:bg-gray-100 text-base transition duration-300 ease-in-out'>
               {window.typeFeature === collectionType ? <span className='text-xs text-custom-color-title'>Drag tabs here.</span> : <span className='text-xs text-custom-color-title'>Empty.</span>}
            </div>
         ) : (
            <Grid2 columns={window.typeDisplay === ActionTab.typeTabHori ? { xs: 4, sm: 4, md: 4 } : { xs: 1, sm: 1, md: 1 }} container spacing={1}>
               {window.windowTab.tabs.map((tab, index) => (
                  <Grid2 size={{ xs: 1, sm: 1, md: 1 }} key={index}>
                     <Tab tab={tab} index={index} typeDisplay={window.typeDisplay} display={window.typeFeature} key={index} />
                  </Grid2>
               ))}
               {window.typeFeature === tabType ? (
                  <Grid2 size={{ xs: 1, sm: 1, md: 1 }}>
                     <Tooltip disableInteractive title={"Open new tab"} TransitionComponent={Zoom} TransitionProps={{ timeout: 200 }}>
                        <div
                           onClick={(e) => {
                              e.stopPropagation();
                              addNewEmptyTab(window.windowTab.id);
                           }}
                           style={window.typeDisplay === ActionTab.typeBlock ? { height: "40px", padding: "8px" } : {}}
                           className='cursor-pointer border-1 flex justify-center items-center p-1.5 rounded hover:bg-gray-100 text-base transition duration-300 ease-in-out'>
                           <HiOutlinePlus className={`${window.typeDisplay === ActionTab.typeTabHori ? "w-full h-full" : ""}`} />
                        </div>
                     </Tooltip>
                  </Grid2>
               ) : (
                  <Grid2 size={{ xs: 1, sm: 1, md: 1 }}>
                     <div
                        className={`cursor-pointer border-dashed flex justify-center items-center border-1 ${
                           window.typeDisplay === ActionTab.typeBlock ? "p-2 h-10" : "p-0.5 h-custom-tab"
                        } rounded hover:bg-gray-100 transition duration-300 ease-in-out`}>
                        <span className='text-xxs text-center text-custom-color-title'>Drag here.</span>
                     </div>
                  </Grid2>
               )}
            </Grid2>
         )}
      </div>
   );
}

export default ListTab;

/** @format */
import Tab from "./Tab";
import { useDrag, useDrop } from "react-dnd";
import React, { useRef } from "react";
import serviceChrome from "../../services/ServiceChrome";
import { HiOutlinePlus } from "react-icons/hi2";
import { Tooltip, Zoom } from "@mui/material";
import { Grid2 } from "@mui/material";
import { ActionTab } from "../../../enums/ActionTab";

/* global chrome */

function ListTab({ window }) {
   const dropRef = useRef(null);
   const [{ isOver }, drop] = useDrop({
      accept: "ITEM",
      drop: (item, monitor) => {
         const tabId = item.tabId;
         const clientOffset = monitor.getClientOffset();
         const hoverIndex = calculateHoverIndex(
            clientOffset,
            dropRef,
            window.windowTab.tabs,
            process.env.REACT_APP_TYPE_AMOUNT_COLUMNS_TAB,
            window.typeDisplay
         );
         serviceChrome.moveTab(tabId, hoverIndex, window.windowTab.id);
      },
      collect: (monitor) => ({
         isOver: !!monitor.isOver(),
      }),
   });

   const calculateHoverIndex = (
      clientOffset,
      dropRef,
      tabs,
      columns,
      typeDisplay
   ) => {
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
         const {
            left: containerLeft,
            top: containerTop,
            width: containerWidth,
            height: containerHeight,
         } = containerRect;
         const relativeX = clientOffset.x - containerLeft;
         const relativeY = clientOffset.y - containerTop;
         const averageTabWidth = containerWidth / columns;
         const averageTabHeight =
            containerHeight / Math.ceil(tabs.length / columns);

         const columnIndex = Math.floor(relativeX / averageTabWidth);
         const rowIndex = Math.floor(relativeY / averageTabHeight);
         let hoverIndex = rowIndex * columns + columnIndex;
         if (
            columnIndex < 0 ||
            columnIndex >= columns ||
            rowIndex < 0 ||
            hoverIndex >= tabs.length
         ) {
            return -1;
         }
         hoverIndex = Math.max(0, Math.min(hoverIndex, tabs.length - 1));
         if (hoverIndex >= tabs.length) {
            return -1; // Trả về -1 nếu hoverIndex ngoài phạm vi của tabs
         }

         return hoverIndex;
      }
   };

   const combinedRef = (el) => {
      dropRef.current = el;
      drop(el);
   };

   const addNewEmptyTab = (windowId) => {
      serviceChrome.openNewTabEmpty(windowId);
   };

   return (
      <div ref={combinedRef}>
         <Grid2
            columns={
               window.typeDisplay === ActionTab.typeTabHori
                  ? { xs: 4, sm: 4, md: 4 }
                  : { xs: 1, sm: 1, md: 1 }
            }
            container
            spacing={1}>
            {window.windowTab.tabs.map((tab, index) => (
               <Grid2 size={{ xs: 1, sm: 1, md: 1 }} key={index}>
                  <Tab
                     tab={tab}
                     index={index}
                     typeDisplay={window.typeDisplay}
                     key={index}
                  />
               </Grid2>
            ))}
            <Grid2 size={{ xs: 1, sm: 1, md: 1 }}>
               <Tooltip
                  disableInteractive
                  title={"Open new tab"}
                  TransitionComponent={Zoom}
                  TransitionProps={{ timeout: 200 }}>
                  <div
                     onClick={(e) => {
                        e.stopPropagation();
                        addNewEmptyTab(window.windowTab.id);
                     }}
                     style={
                        window.typeDisplay === ActionTab.typeBlock
                           ? { height: "40px", padding: "8px" }
                           : {}
                     }
                     className='cursor-pointer border-1 flex justify-center items-center p-1.5 rounded hover:bg-gray-100 text-base transition duration-300 ease-in-out'>
                     <HiOutlinePlus
                        className={`${
                           window.typeDisplay === ActionTab.typeTabHori
                              ? "w-full h-full"
                              : ""
                        }`}
                     />
                  </div>
               </Tooltip>
            </Grid2>
         </Grid2>
      </div>
   );
}

export default ListTab;
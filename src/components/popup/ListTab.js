/** @format */
import Tab from "./Tab";
import { useDrag, useDrop } from "react-dnd";
import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { moveTab } from "../../store/features/windowSlices";
import serviceChrome from "../services/ServiceChrome";
import { HiOutlinePlus } from "react-icons/hi2";
import { Tooltip, Zoom } from "@mui/material";
import { Grid2 } from "@mui/material";

function ListTab({ window, valueType }) {
   const dropRef = useRef(null);
   const dispatch = useDispatch();
   const [{ isOver }, drop] = useDrop({
      accept: "ITEM",
      drop: (item, monitor) => {
         console.log("item : ", item);
         const clientOffset = monitor.getClientOffset();
         const hoverIndex = calculateHoverIndexHori(
            clientOffset,
            dropRef,
            window.windowTab.tabs,
            5
         );
         const payload = {
            tabDrag: {
               ...item,
            },

            tabHover: {
               index: hoverIndex,
               windowId: window.windowTab.id,
            },
         };
         dispatch(moveTab(payload));
      },
      collect: (monitor) => ({
         isOver: !!monitor.isOver(),
      }),
   });

   const calculateHoverIndex = (clientOffset, dropRef, tabs) => {
      const containerRect = dropRef.current.getBoundingClientRect();
      const { top: containerTop, height: containerHeight } = containerRect;

      const relativeY = clientOffset.y - containerTop;

      const averageTabHeight = containerHeight / tabs.length;

      let hoverIndex = Math.round(relativeY / averageTabHeight);

      hoverIndex = Math.max(0, Math.min(hoverIndex, tabs.length - 1));

      return hoverIndex;
   };

   const calculateHoverIndexHori = (clientOffset, dropRef, tabs, columns) => {
      const containerRect = dropRef.current.getBoundingClientRect();
      const { left: containerLeft, width: containerWidth } = containerRect;

      const relativeX = clientOffset.x - containerLeft;

      const averageTabWidth = containerWidth / columns;

      let hoverIndex = Math.round(relativeX / averageTabWidth);

      // Adjust the hoverIndex based on the number of rows (i.e., index within the grid)
      const rowIndex = Math.floor(hoverIndex / columns);
      const columnIndex = hoverIndex % columns;

      hoverIndex = rowIndex * columns + columnIndex;

      // Ensure hoverIndex is within bounds
      hoverIndex = Math.max(0, Math.min(hoverIndex, tabs.length - 1));

      return hoverIndex;
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
         <Grid2 columns={{ xs: 4, sm: 4, md: 4 }} container spacing={1}>
            {window.windowTab.tabs.map((tab, index) => (
               <Grid2 size={{ xs: 1, sm: 1, md: 1 }} key={index}>
                  <Tab
                     tab={tab}
                     index={index}
                     type={
                        valueType.checkStateWindow
                           ? valueType.typeTabBlock
                           : valueType.typeTabHori
                     }
                     key={index}
                  />
               </Grid2>
            ))}
            <Grid2 size={{ xs: 1, sm: 1, md: 1 }}>
               <Tooltip
                  disableInteractive
                  title={"Open New Tab"}
                  TransitionComponent={Zoom}
                  TransitionProps={{ timeout: 300 }}>
                  <div
                     onClick={(e) => {
                        e.stopPropagation();
                        addNewEmptyTab(window.windowTab.id);
                     }}
                     className='cursor-pointer border-1 flex justify-center items-center p-1.5 rounded hover:bg-gray-100 text-base transition duration-300 ease-in-out'>
                     <HiOutlinePlus className='w-full h-full' />
                  </div>
               </Tooltip>
            </Grid2>
         </Grid2>
      </div>
   );
}

export default ListTab;

/** @format */

import React, { useState } from "react";
import TaskBar from "./TaskBar";
import { useSelector, useDispatch } from "react-redux";
import services from "../services/ServiceChrome";
import ListTab from "./ListTab";
import { IoCloseOutline } from "react-icons/io5";
import serviceChrome from "../services/ServiceChrome";
import { Tooltip, Zoom } from "@mui/material";
/* global chrome */

function WindowTab({ window }) {
   const currentWindow = useSelector((state) => state.current.value);

   const closeAllTabWindows = (windowCurrentId) => {
      serviceChrome.closeWindow(windowCurrentId);
   };

   return (
      <div className='w-full'>
         <div
            onClick={(e) => {
               services.switchToWindow(currentWindow);
               services.switchToWindow(window.windowTab.id);
            }}
            className='transition duration-200 ease-in space-y-2 hover:-translate-y-0.5 bg-white p-2 hover:shadow-custom-hover cursor-pointer shadow-custom rounded-md z-10'>
            <div className='flex justify-between items-center'>
               <span className='text-custom-color-title text-xs font-semibold'>
                  #{window.index + 1}
               </span>
               <Tooltip
                  disableInteractive
                  TransitionComponent={Zoom}
                  TransitionProps={{ timeout: 200 }}
                  title={"Close window"}>
                  <div
                     onClick={(e) => {
                        e.stopPropagation();
                        closeAllTabWindows(window.windowTab.id);
                     }}
                     className='flex items-center justify-center p-1 bg-gray-300 rounded-full cursor-pointer hover:bg-custom-pink transition duration-300 ease-in-out'>
                     <IoCloseOutline className='text-xs text-white transition-transform duration-300 ease-in-out transform rotate-0' />
                  </div>
               </Tooltip>
            </div>
            <span className='text-xs font-medium text-center'>
               ${window.windowTab.tabs.length}
            </span>

            <ListTab window={window} />
            <TaskBar window={window} />
         </div>
      </div>
   );
}

export default WindowTab;

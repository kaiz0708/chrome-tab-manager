/** @format */

import React, { useRef, useState, lazy, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import services from "../../services/ServiceChrome";
import { IoCloseOutline } from "react-icons/io5";
import serviceChrome from "../../services/ServiceChrome";
import { Tooltip, Zoom } from "@mui/material";
const ListTab = lazy(() => import("./ListTab"));
/* global chrome */

function WindowTab({ window }) {
   const currentWindow = useSelector((state) => state.current.value);

   const closeAllTabWindows = (windowCurrentId) => {
      serviceChrome.closeWindow(windowCurrentId);
   };

   return (
      <div
         onClick={(e) => {
            services.switchToWindow(currentWindow);
            services.switchToWindow(window.windowTab.id);
         }}
         className='transition duration-200 ease-in space-y-2 hover:-translate-y-1 bg-white p-2 hover:shadow-custom-hover cursor-pointer shadow-custom rounded-md z-10 will-change-transform will-change-shadow'>
         <div className='flex justify-between items-center'>
            <span>
               {window.typeFeature === process.env.REACT_APP_TYPE_TAB ? (
                  <span className='text-custom-color-title text-xs font-semibold'>#{window.index + 1}</span>
               ) : (
                  <span className='text-custom-color-title text-xs font-semibold'>#{window.windowTab.name}</span>
               )}

               <span className='text-xs font-medium text-center'>{window.windowTab.tabs.length > 1 ? <span> ({window.windowTab.tabs.length} tabs)</span> : <span> ({1} tab)</span>}</span>
            </span>
            <Tooltip disableInteractive TransitionComponent={Zoom} TransitionProps={{ timeout: 200 }} title={"Close window"}>
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

         {window.typeFeature === process.env.REACT_APP_TYPE_TAB ? null : (
            <div>
               <span className='text-xs font-medium text-center'>${window.windowTab.date}</span>
            </div>
         )}

         <ListTab window={window} />
      </div>
   );
}

export default WindowTab;

/** @format */

import React, { useState, useEffect, useRef } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import Tab from "./Tab";
import TaskBar from "./TaskBar";
/* global chrome */

function WindowTab({ window }) {
   const [checkStateWindow, setCheckStateWindow] = useState(false);
   const typeTabBlock = process.env.REACT_APP_TYPE_TAB_BLOCK;
   const typeTabHori = process.env.REACT_APP_TYPE_TAB_HORIZONTAL;

   const switchToWindow = (windowId) => {
      chrome.windows.update(windowId, { focused: true }, () => {
         console.log(`Switched to window with ID: ${windowId}`);
      });
   };

   return (
      <div
         onClick={(e) => {
            switchToWindow(window.windowTab.id);
         }}
         className='transition-shadow duration-300 hover:shadow-custom-hover p-2 cursor-pointer shadow-custom rounded-md z-10 space-y-3'>
         <div className='flex justify-between items-center'>
            <span className='text-custom-color-title text-xs font-semibold'>
               Window : {window.index + 1}
            </span>
            <div
               onClick={(e) => {
                  e.stopPropagation();
                  checkStateWindow
                     ? setCheckStateWindow(false)
                     : setCheckStateWindow(true);
               }}
               className='flex items-center justify-center p-1 bg-gray-300 rounded-full cursor-pointer hover:bg-custom-pink transition duration-300 ease-in-out'>
               {checkStateWindow ? (
                  <IoIosArrowDown className='text-xs text-white transition-transform duration-300 ease-in-out transform rotate-0' />
               ) : (
                  <IoIosArrowForward className='text-xs text-white transition-transform duration-300 ease-in-out transform rotate-0' />
               )}
            </div>
         </div>
         <span className='text-xs font-medium text-center'>
            Total : {window.windowTab.tabs.length}
         </span>

         <div
            className={`transition-all duration-400 ease-in-out ${
               checkStateWindow
                  ? "max-h-[1000px] transform translate-y-0 overflow-visible"
                  : "max-h-[1000px] transform -translate-y-1 overflow-visible"
            }`}>
            <div
               class={`${
                  checkStateWindow ? "space-y-1" : "flex relative gap-2.5"
               }`}>
               {window.windowTab.tabs.map((tab) => (
                  <Tab
                     className={`${
                        checkStateWindow ? "first:mt-0 last:mb-0" : ""
                     }`}
                     tab={tab}
                     window={window}
                     type={checkStateWindow ? typeTabBlock : typeTabHori}
                  />
               ))}
            </div>
         </div>

         <TaskBar window={window} />
      </div>
   );
}

export default WindowTab;

/** @format */

import React, { useState, useEffect, useRef } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { CiSquarePlus } from "react-icons/ci";
import { PiTrashLight } from "react-icons/pi";
import Tab from "./Tab";
import TaskBar from "./TaskBar";
/* global chrome */

function WindowTab({ window }) {
   const [windowCurrent, setWindowCurrent] = useState(window.windowCurrent);

   const statusListWindowTab = (windowId, status) => {
      if (status === "open") {
         setWindowCurrent((prevWindowCurrent) => [
            ...prevWindowCurrent,
            windowId,
         ]);
      } else {
         setWindowCurrent((prevWindowCurrent) =>
            prevWindowCurrent.filter((winId) => winId !== windowId)
         );
      }
   };

   const checkWindowOpenOrClose = (winId) => {
      return windowCurrent.includes(winId);
   };

   return (
      <div className='p-2 shadow-custom rounded-md z-10 space-y-3'>
         <div className='flex justify-between items-center'>
            <span className='text-custom-color-title text-xs font-semibold'>
               Window : {window.index + 1}
            </span>
            <div
               onClick={() => {
                  checkWindowOpenOrClose(window.windowTab.id)
                     ? statusListWindowTab(window.windowTab.id, "close")
                     : statusListWindowTab(window.windowTab.id, "open");
               }}
               className='flex items-center justify-center p-1 bg-gray-300 rounded-full cursor-pointer hover:bg-custom-pink transition duration-300 ease-in-out'>
               {checkWindowOpenOrClose(window.windowTab.id) ? (
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
            className={`transition-all duration-300 ease-in-out ${
               checkWindowOpenOrClose(window.windowTab.id)
                  ? "max-h-[1000px] opacity-100 transform translate-y-0 overflow-visible"
                  : "max-h-0 opacity-0 transform -translate-y-4 overflow-hidden"
            }`}>
            {window.windowTab.tabs.map((tab) => (
               <Tab tab={tab} window={window} />
            ))}
         </div>

         <TaskBar window={window} />
      </div>
   );
}

export default WindowTab;

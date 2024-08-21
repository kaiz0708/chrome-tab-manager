/** @format */
import React, { useState, useEffect, useRef } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { CiSquarePlus } from "react-icons/ci";
import { PiTrashLight } from "react-icons/pi";

/* global chrome */

function TaskBar({ window }) {
   const addNewEmptyTab = (windowId) => {
      chrome.tabs.query({ windowId: windowId }, (tabs) => {
         chrome.tabs.create({});
      });
   };

   const closeAllTabWindows = (windowCurrentId) => {
      chrome.windows.remove(windowCurrentId, () => {
         // Có thể thêm logic sau khi cửa sổ được đóng nếu cần
         console.log(`Window ${windowCurrentId} has been closed.`);
      });
   };

   return (
      <div className='z-10 flex justify-end'>
         <div className='cursor-pointer'>
            <CiSquarePlus
               onClick={() => {
                  addNewEmptyTab(window.windowTab.id);
               }}
               className='size-6'
            />
         </div>

         <div>
            <PiTrashLight
               onClick={() => {
                  closeAllTabWindows(window.windowTab.id);
               }}
               className='size-6'
            />
         </div>
      </div>
   );
}

export default TaskBar;

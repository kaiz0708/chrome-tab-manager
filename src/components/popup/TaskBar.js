/** @format */
import { CiSquarePlus } from "react-icons/ci";
import { PiTrashLight } from "react-icons/pi";
import { CiSaveDown1 } from "react-icons/ci";
import {
   setValue,
   deleteWindow,
   addEmptyTab,
} from "../../store/features/windowSlices";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";

/* global chrome */

function TaskBar({ window }) {
   const dispatch = useDispatch();
   const addNewEmptyTab = (windowId) => {
      chrome.tabs.create(
         {
            windowId: windowId,
         },
         (newTab) => {
            if (chrome.runtime.lastError) {
               console.error(
                  "Error creating new tab:",
                  chrome.runtime.lastError
               );
            } else {
               let tabAdd = {
                  windowId,
                  newTab,
               };
               dispatch(addEmptyTab(tabAdd));
               console.log("New tab created successfully:", newTab);
            }
         }
      );
   };

   const closeAllTabWindows = (windowCurrentId) => {
      chrome.windows.remove(windowCurrentId, () => {
         console.log("delete success");
      });
      dispatch(deleteWindow(windowCurrentId));
   };

   const minimizeWindow = (windowCurrentId) => {
      chrome.windows.update(windowCurrentId, { state: "minimized" });
   };

   return (
      <div className='z-10 flex justify-end gap-1.5'>
         <div
            onClick={(e) => {
               e.stopPropagation();
               addNewEmptyTab(window.windowTab.id);
            }}
            className='cursor-pointer border-1 border-opacity-5 p-1 rounded hover:text-white hover:bg-custom-color-tooltip text-base transition duration-300 ease-in-out'>
            <CiSquarePlus className='text-xl' />
         </div>

         <div
            onClick={(e) => {
               e.stopPropagation();
               closeAllTabWindows(window.windowTab.id);
            }}
            className='cursor-pointer border-1 border-opacity-5 p-1 rounded hover:text-white hover:bg-custom-color-tooltip text-base transition duration-300 ease-in-out'>
            <PiTrashLight className='text-xl' />
         </div>

         <div
            onClick={(e) => {
               e.stopPropagation();
               minimizeWindow(window.windowTab.id);
            }}
            className='cursor-pointer border-1 border-opacity-5 p-1 rounded hover:text-white hover:bg-custom-color-tooltip text-base transition duration-300 ease-in-out'>
            <CiSaveDown1 className='text-xl' />
         </div>
      </div>
   );
}

export default TaskBar;

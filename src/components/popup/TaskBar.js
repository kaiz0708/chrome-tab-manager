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
      <div className='z-10 flex justify-end'>
         <div className='cursor-pointer'>
            <CiSquarePlus
               onClick={(e) => {
                  e.stopPropagation();
                  addNewEmptyTab(window.windowTab.id);
               }}
               className='size-6'
            />
         </div>

         <div>
            <PiTrashLight
               onClick={(e) => {
                  e.stopPropagation();
                  closeAllTabWindows(window.windowTab.id);
               }}
               className='size-6'
            />
         </div>

         <div>
            <CiSaveDown1
               onClick={(e) => {
                  e.stopPropagation();
                  minimizeWindow(window.windowTab.id);
               }}
               className='size-6'
            />
         </div>
      </div>
   );
}

export default TaskBar;

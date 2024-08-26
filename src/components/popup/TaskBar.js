/** @format */
import { CiSquarePlus } from "react-icons/ci";
import { PiTrashLight } from "react-icons/pi";
import { setValue, deleteWindow } from "../../store/features/windowSlices";
import { useSelector, useDispatch } from "react-redux";

/* global chrome */

function TaskBar({ window }) {
   const dispatch = useDispatch();
   const addNewEmptyTab = (windowId) => {
      chrome.tabs.query({ windowId: windowId }, (tabs) => {
         chrome.tabs.create({});
      });
   };

   const closeAllTabWindows = (windowCurrentId) => {
      chrome.windows.remove(windowCurrentId, () => {
         console.log("delete success");
      });
      dispatch(deleteWindow(windowCurrentId));
   };

   return (
      <div className='z-10 flex justify-end'>
         <div className='cursor-pointer'>
            <CiSquarePlus
               onClick={(e) => {
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
      </div>
   );
}

export default TaskBar;

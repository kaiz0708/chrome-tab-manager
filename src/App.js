/** @format */

import React, { useState, useEffect, useRef } from "react";
import WindowTab from "./components/popup/WindowTab";
import { useSelector, useDispatch } from "react-redux";
import { setValue, deleteWindow } from "./store/features/windowSlices";
/* global chrome */
function App() {
   const windowTabs = useSelector((state) => state.window.value);
   const dispatch = useDispatch();

   useEffect(() => {
      chrome.windows.getCurrent({ populate: true }, (currentWindow) => {
         // Lấy tất cả cửa sổ
         chrome.windows.getAll({ populate: true }, (windows) => {
            // Sắp xếp cửa sổ, đưa cửa sổ hiện tại lên đầu
            const sortedWindows = windows.sort((a, b) => {
               if (a.id === currentWindow.id) return -1;
               if (b.id === currentWindow.id) return 1;
               return 0;
            });

            // Cập nhật danh sách cửa sổ vào Redux
            dispatch(setValue(sortedWindows));
         });
      });
   }, []);

   const TabList = ({ tabs }) => {
      const visibleTabs = 2;

      return (
         <span>
            {tabs.length <= visibleTabs ? (
               tabs.map((tab) => <span>{new URL(tab.url).hostname}</span>)
            ) : (
               <span>
                  {tabs.slice(0, visibleTabs).map((tab) => (
                     <span>{new URL(tab.url).hostname.split(".")[1]}, </span>
                  ))}
                  <span>{tabs.length - visibleTabs} more</span>
               </span>
            )}
         </span>
      );
   };

   return (
      <div className='w-full p-2 font-sans text-xs font-normal text-custom-black'>
         <h1 className='text-2xl font-normal mb-4 text-custom-color-title text-center'>
            Chrome Tab Manager
         </h1>
         <div>
            {windowTabs.map((windowTab, index) => (
               <WindowTab window={{ windowTab, index }} />
            ))}
         </div>
      </div>
   );
}

export default App;

/** @format */
import React, { useState, useEffect, useRef } from "react";
import { IoIosClose } from "react-icons/io";
import { IoEarthOutline } from "react-icons/io5";

/* global chrome */

function Tab({ tab, window }) {
   const [showTooltip, setShowTooltip] = useState(false);
   const [tabHoverId, setTabHoverId] = useState();
   const [showCloseTab, setShowCloseTab] = useState(false);
   const [activeTab, setActiveTab] = useState(true);
   const hoverTimeoutRef = useRef(null);

   const closeTab = (tabId, windowId) => {
      chrome.tabs.query({ windowId: windowId }, (tabs) => {
         chrome.tabs.remove(tabId);
      });
   };

   const delayTimeDisplayDescription = () => {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = setTimeout(() => {
         setShowTooltip(true);
      }, 1000);
   };

   const switchToTab = (tabId) => {
      chrome.tabs.get(tabId, (tab) => {
         chrome.windows.update(tab.windowId, { focused: true }, () => {
            chrome.tabs.update(tabId, { active: true });
         });
      });
   };

   const handleMouseLeave = () => {
      clearTimeout(hoverTimeoutRef.current);
      setShowCloseTab(false);
      setShowTooltip(false);
   };

   const checkActveTab = (tab, hover) => {
      if (tab && hover) {
         setActiveTab(false);
      } else {
         setActiveTab(true);
      }
   };

   return (
      <div className='relative'>
         <div
            onClick={() => switchToTab(tab.id)}
            onMouseEnter={() => {
               setShowCloseTab(true);
               setTabHoverId(tab.id);
               checkActveTab(tab.active, true);
               delayTimeDisplayDescription();
            }}
            onMouseLeave={() => {
               handleMouseLeave();
               checkActveTab(tab.active, false);
            }}
            className='hover:bg-custom-color-tooltip hover:border-1 transition-all z-10 duration-400 ease-in-out flex space-x-1 h-10 items-center border-g cursor-pointer hover:shadow-md hover:p-3 justify-between p-1 border-solid rounded'>
            <div className='w-5'>
               {tab.favIconUrl != null ? (
                  <img className='w-100% rounded-sm' src={tab.favIconUrl} />
               ) : (
                  <div className='h-5 bg-gray-100 rounded-sm flex justify-center items-center'>
                     <IoEarthOutline className='text-xs' />
                  </div>
               )}
            </div>
            <p className='truncate flex-1 mr-2'>{tab.title}</p>
            {activeTab && tab.active ? (
               <div>
                  {tab.active ? (
                     <span className='ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-green-500 text-white'>
                        active
                     </span>
                  ) : (
                     <span></span>
                  )}
               </div>
            ) : (
               <div></div>
            )}
            {showCloseTab && tabHoverId == tab.id ? (
               <IoIosClose
                  onClick={() => closeTab(tab.id, window.windowTab.id)}
                  className=' hover:bg-custom-pink cursor-pointer text-white bg-gray-200 rounded-full text-base transition duration-300 ease-in-out'
               />
            ) : (
               <div></div>
            )}
         </div>

         <div>
            {showTooltip && tabHoverId == tab.id ? (
               <div
                  className='absolute w-full z-[999] px-2 text-xs py-2 font-normal text-black bg-custom-hover-gray transition-all duration-200 ease-[cubic-bezier(0.25, 0.1, 0.25, 1)] rounded-lg shadow-sm tooltip dark:bg-gray-700'
                  style={{
                     top: "calc(100% + 5px)",
                     left: "0",
                     transform: "none",
                  }}>
                  {tab.title}
               </div>
            ) : (
               <div className='tooltip-arrow' data-popper-arrow></div>
            )}
         </div>
      </div>
   );
}

export default Tab;

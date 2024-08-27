/** @format */
import React, { useState, useEffect, useRef } from "react";
import { IoIosClose } from "react-icons/io";
import { IoEarthOutline } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { deleteTab } from "../../store/features/windowSlices";

/* global chrome */

function Tab({ tab, window, type }) {
   const dispatch = useDispatch();
   const [showTooltip, setShowTooltip] = useState(false);
   const [tabHoverId, setTabHoverId] = useState();
   const [showCloseTab, setShowCloseTab] = useState(false);
   const [activeTab, setActiveTab] = useState(true);
   const hoverTimeoutRef = useRef(null);
   const typeTabBlock = process.env.REACT_APP_TYPE_TAB_BLOCK;
   const typeTabHori = process.env.REACT_APP_TYPE_TAB_HORIZONTAL;

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
      <div className={`${type === typeTabBlock ? "relative" : ""}`}>
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
            className={`hover:bg-custom-color-tooltip relative ${
               type === typeTabHori
                  ? "p-2"
                  : "p-1 h-10 hover:p-3 transition-all duration-400 ease-in-out"
            } border-1 border-opacity-5 z-10 flex space-x-1 items-center cursor-pointer hover:shadow-md justify-between border-solid rounded`}>
            <div className='w-5'>
               {tab.favIconUrl === "" || tab.favIconUrl === undefined ? (
                  <div className='h-5 bg-gray-100 rounded-sm flex justify-center items-center'>
                     <IoEarthOutline className='text-xs' />
                  </div>
               ) : (
                  <img className='w-100% rounded-sm' src={tab.favIconUrl} />
               )}
            </div>
            {type === typeTabBlock ? (
               <p className='truncate flex-1 mr-2'>{tab.title}</p>
            ) : null}
            {tab.active && activeTab ? (
               type === typeTabBlock ? (
                  <span className='ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-green-500 text-white'>
                     active
                  </span>
               ) : (
                  <span className='absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full'></span>
               )
            ) : null}
            {showCloseTab ? (
               type === typeTabBlock ? (
                  <IoIosClose
                     onClick={(e) => {
                        e.stopPropagation();
                        dispatch(deleteTab(tab));
                        closeTab(tab.id, window.windowTab.id);
                     }}
                     className=' hover:bg-custom-pink cursor-pointer text-white bg-gray-200 rounded-full text-base transition duration-300 ease-in-out'
                  />
               ) : (
                  <IoIosClose
                     onClick={(e) => {
                        e.stopPropagation();
                        dispatch(deleteTab(tab.id));
                        closeTab(tab.id, window.windowTab.id);
                     }}
                     className='absolute hover:bg-custom-pink top-0 right-0 cursor-pointer text-white bg-gray-200 rounded-full text-base transition duration-300 ease-in-out'
                  />
               )
            ) : null}
         </div>

         <div>
            {showTooltip ? (
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

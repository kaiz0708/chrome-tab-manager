/** @format */
import React, { useState, useEffect, useRef } from "react";
import { IoIosClose } from "react-icons/io";
import { IoEarthOutline } from "react-icons/io5";
import servicesChrome from "../services/ServiceChrome";
import { Tooltip, Zoom } from "@mui/material";
import { useDrag, useDrop } from "react-dnd";

/* global chrome */

function Tab({ tab, index, type }) {
   const [showCloseTab, setShowCloseTab] = useState(false);
   const [activeTab, setActiveTab] = useState(true);
   const typeTabBlock = process.env.REACT_APP_TYPE_TAB_BLOCK;
   const typeTabHori = process.env.REACT_APP_TYPE_TAB_HORIZONTAL;

   const [{ isDragging }, drag] = useDrag({
      type: "ITEM",
      item: { index, windowId: tab.windowId },
      collect: (monitor) => ({
         isDragging: !!monitor.isDragging(),
      }),
   });

   const closeTab = (tabId, windowId) => {
      servicesChrome.closeTab(tabId, windowId);
   };

   const switchToTab = (tabId) => {
      servicesChrome.switchToTab(tabId);
   };

   const checkActveTab = (tab, hover) => {
      if (tab && hover) {
         setActiveTab(false);
      } else {
         setActiveTab(true);
      }
   };

   return (
      <div ref={drag} className={`${type === typeTabBlock ? "relative" : ""} `}>
         <Tooltip
            TransitionComponent={Zoom}
            TransitionProps={{ timeout: 300 }}
            onClick={() => switchToTab(tab.id)}
            disableInteractive
            title={tab.title}>
            <div
               onMouseEnter={() => {
                  setShowCloseTab(true);
                  checkActveTab(tab.active, true);
               }}
               onMouseLeave={() => {
                  setShowCloseTab(false);
                  checkActveTab(tab.active, false);
               }}
               className={` relative ${
                  type === typeTabHori
                     ? "p-1.5 hover:animate-hoverEffect aspect-square"
                     : "p-1 h-10 hover:animate-hoverEffectBlock"
               } border-1 border-opacity-5 z-10 flex space-x-1 items-center cursor-pointer hover:shadow-md justify-between border-solid rounded`}>
               <div className='w-full h-full flex justify-center items-center'>
                  {tab.favIconUrl === "" || tab.favIconUrl === undefined ? (
                     <div className='h-full w-full bg-gray-100 rounded-sm flex justify-center items-center'>
                        <IoEarthOutline className='text-xs' />
                     </div>
                  ) : (
                     <img
                        className='w-full h-full rounded-sm object-contain'
                        src={tab.favIconUrl}
                     />
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
                     <span className='absolute z-20 -top-1.5 -right-1.5 w-4 h-4 bg-green-500 rounded-full'></span>
                  )
               ) : null}
               {showCloseTab ? (
                  type === typeTabBlock ? (
                     <IoIosClose
                        onClick={(e) => {
                           e.stopPropagation();
                           closeTab(tab.id, tab.windowId);
                        }}
                        className=' hover:bg-custom-pink cursor-pointer text-white bg-gray-200 rounded-full text-base transition duration-300 ease-in-out'
                     />
                  ) : (
                     <IoIosClose
                        onClick={(e) => {
                           e.stopPropagation();
                           closeTab(tab.id, tab.windowId);
                        }}
                        className='absolute z-20 hover:bg-custom-pink -top-1.5 -right-1.5 cursor-pointer text-white bg-gray-200 rounded-full text-base transition duration-300 ease-in-out'
                     />
                  )
               ) : null}
            </div>
         </Tooltip>
      </div>
   );
}

export default Tab;

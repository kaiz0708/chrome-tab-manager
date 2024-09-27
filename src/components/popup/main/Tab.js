/** @format */
import React, { useState, useEffect, useRef, lazy } from "react";
import { IoIosClose } from "react-icons/io";
import { IoEarthOutline } from "react-icons/io5";
import servicesChrome from "../../services/ServiceChrome";
import { Tooltip, Zoom } from "@mui/material";
import { useDrag, useDrop } from "react-dnd";
import { ActionTab } from "../../../enums/ActionTab";

/* global chrome */

function Tab({ tab, index, typeDisplay }) {
   const [showCloseTab, setShowCloseTab] = useState(false);
   const [activeTab, setActiveTab] = useState(true);

   const [{ isDragging }, drag] = useDrag({
      type: "ITEM",
      item: { index, tab },
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
      <div ref={drag} className={`${isDragging ? "transition-all duration-300 ease-in-out" : ""} `}>
         <Tooltip TransitionComponent={Zoom} TransitionProps={{ timeout: 200 }} onClick={() => switchToTab(tab.id)} disableInteractive title={tab.title}>
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
                  typeDisplay === process.env.REACT_APP_TYPE_TAB_HORIZONTAL ? "p-1.5 aspect-square" : "p-1.5 h-10"
               } w-full flex justify-center items-center hover:bg-gray-100 transition-all duration-300 ease-in-out border-1 border-opacity-5 z-10 space-x-1 cursor-pointer border-solid rounded`}>
               <div className='h-5 w-5'>{tab.favIconUrl === "" || tab.favIconUrl === undefined ? <IoEarthOutline className='w-full h-full' /> : <img className='rounded-sm object-contain w-full h-full' src={tab.favIconUrl} />}</div>
               {typeDisplay === ActionTab.typeBlock ? <p className='truncate flex-1 mr-2'>{tab.title}</p> : null}
               {tab.active && activeTab ? (
                  typeDisplay === ActionTab.typeBlock ? (
                     <span className='ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-green-500 text-white'>active</span>
                  ) : (
                     <span className='absolute z-20 -top-1.5 -right-1.5 w-4 h-4 bg-green-500 rounded-full'></span>
                  )
               ) : null}
               {showCloseTab ? (
                  typeDisplay === ActionTab.typeBlock ? (
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

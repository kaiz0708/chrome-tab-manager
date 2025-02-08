/** @format */
import React, { useState, useEffect, useRef, lazy } from "react";
import { IoIosClose } from "react-icons/io";
import { IoEarthOutline } from "react-icons/io5";
import { Tooltip, Zoom } from "@mui/material";
import { useDrag, useDrop } from "react-dnd";
import { ActionTab } from "../../../../enums/action";
import { useDispatch } from "react-redux";
import { deleteCollectionItem } from "../../../../store/features/windowSlices";
import servicePopup from "../../servicePopup";
import serviceChrome from "../../../services/ServiceChrome";
import { addNoti, updateAuth } from "../../../../store/features/popupSlices";
import { v4 as uuidv4 } from "uuid";

/* global chrome */

function Tab({ tab, index, typeDisplay, display }) {
   const [showCloseTab, setShowCloseTab] = useState(false);
   const [activeTab, setActiveTab] = useState(true);
   const dispatch = useDispatch();
   const [{ isDragging }, drag] = useDrag({
      type: "SUB_ITEM",
      item: { index, tab, display, type: "tab" },
      collect: (monitor) => ({
         isDragging: !!monitor.isDragging(),
      }),
   });

   const closeTab = (tabId, windowId) => {
      serviceChrome.closeTab(tabId, windowId);
   };

   const deleteItemCollection = async (collectionId, tab) => {
      const response = await servicePopup.deleteTabToCollection(tab, collectionId);
      if (response === null) {
         dispatch(updateAuth(false));
         dispatch(addNoti({ message: "Session expire, please login again", id: uuidv4(), status: 401 }));
      } else {
         const { data, status, message } = response.data;
         serviceChrome.sendMessage({ idCollection: collectionId, tab: data }, ActionTab.typeDeleteCollection);
         dispatch(deleteCollectionItem({ idCollection: collectionId, tab: data }));
         dispatch(addNoti({ id: uuidv4(), status, message }));
      }
   };

   const switchToTab = (tabId) => {
      serviceChrome.switchToTab(tabId);
   };

   const checkActveTab = (tab, hover) => {
      if (tab && hover) {
         setActiveTab(false);
      } else {
         setActiveTab(true);
      }
   };

   return (
      <div
         draggable
         onDragStart={() => {
            setShowCloseTab(false);
         }}
         onDragEnd={() => {
            setShowCloseTab(false);
         }}
         ref={drag}>
         <Tooltip
            TransitionComponent={Zoom}
            TransitionProps={{ timeout: 250 }}
            onClick={() => {
               switchToTab(tab.id);
            }}
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
               className={` relative ${typeDisplay === process.env.REACT_APP_TYPE_TAB_HORIZONTAL ? "p-1.5 aspect-square" : "p-1.5 h-10"} w-full ${tab.pinned ? "animate-blink" : ""} flex ${
                  isDragging ? "scale-110" : ""
               } justify-center items-center hover:bg-gray-100 transition-all duration-300 ease-in-out border-1 border-opacity-5 z-10 space-x-1 cursor-pointer border-solid rounded`}>
               <div className='h-5 w-5'>
                  {tab.favIconUrl === "" || tab.favIconUrl === undefined || tab.favIconUrl === null ? <IoEarthOutline className='w-full h-full' /> : <img className='rounded-sm object-contain w-full h-full' src={tab.favIconUrl} />}
               </div>
               {typeDisplay === ActionTab.typeBlock ? <p className='truncate flex-1 mr-2'>{tab.title}</p> : null}
               {tab.active && activeTab && display === process.env.REACT_APP_TYPE_TAB ? (
                  typeDisplay === ActionTab.typeBlock ? (
                     <span className='ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-green-500 text-white'>active</span>
                  ) : (
                     <span className='absolute z-20 -top-1.5 -right-1.5 w-4 h-4 bg-green-500 rounded-full'></span>
                  )
               ) : null}
               {showCloseTab ? (
                  <IoIosClose
                     onClick={(e) => {
                        e.stopPropagation();
                        if (display === process.env.REACT_APP_TYPE_TAB) {
                           closeTab(tab.id, tab.windowId);
                        } else {
                           deleteItemCollection(tab.collection, tab);
                        }
                     }}
                     className={`${
                        typeDisplay === ActionTab.typeBlock
                           ? "hover:bg-custom-pink cursor-pointer text-white bg-gray-200 rounded-full text-base transition duration-300 ease-in-out"
                           : "absolute z-20 hover:bg-custom-pink -top-1.5 -right-1.5 cursor-pointer text-white bg-gray-200 rounded-full text-base transition duration-300 ease-in-out"
                     }`}
                  />
               ) : null}
            </div>
         </Tooltip>
      </div>
   );
}

export default Tab;

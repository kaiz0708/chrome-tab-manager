/** @format */

import React, { useRef, useState, lazy, useEffect } from "react";
import serviceChrome from "../../../services/ServiceChrome";
import { useDispatch, useSelector } from "react-redux";
import servicePopup from "../../servicePopup";
import { IoCloseOutline } from "react-icons/io5";
import { Tooltip, Zoom } from "@mui/material";
import { CiCalendarDate } from "react-icons/ci";
import { PiNotePencilThin } from "react-icons/pi";
import { ActionTab } from "../../../../enums/action";
import { deleteCollection } from "../../../../store/features/windowSlices";
import Notification from "../../../notification/Notification";
const ListTab = lazy(() => import("../common/ListTab"));
/* global chrome */

function WindowCollection({ window }) {
   const dispatch = useDispatch();
   const handleDeleteCollection = async (id) => {
      const response = await servicePopup.deleteCollection(id);
      const { data } = response.data;
      serviceChrome.sendMessage({ collection: data }, ActionTab.typeDeleteCollection);
      dispatch(deleteCollection({ collection: data }));
   };
   return (
      <div className='transition duration-200 ease-in space-y-2 hover:-translate-y-1 bg-white p-2 hover:shadow-custom-hover cursor-pointer shadow-custom rounded-md z-10 will-change-transform will-change-shadow'>
         <div className='flex justify-between items-center'>
            <span>
               <span className='text-custom-color-title text-xs font-semibold'>#{window.windowTab.title}</span>

               <span className='text-xs font-medium text-center'>{window.windowTab.tabs.length > 1 ? <span> ({window.windowTab.tabs.length} tabs)</span> : <span> ({1} tab)</span>}</span>
            </span>
            <Tooltip disableInteractive TransitionComponent={Zoom} TransitionProps={{ timeout: 200 }} title={"Close window"}>
               <div
                  onClick={() => {
                     handleDeleteCollection(window.windowTab.id);
                     
                  }}
                  className='flex items-center justify-center p-1 bg-gray-300 rounded-full cursor-pointer hover:bg-custom-pink transition duration-300 ease-in-out'>
                  <IoCloseOutline className='text-xs text-white transition-transform duration-300 ease-in-out transform rotate-0' />
               </div>
            </Tooltip>
         </div>

         <div className='flex items-center space-x-1'>
            <CiCalendarDate className='text-base text-custom-color-title font-bold' /> <span className='text-xs font-medium text-center'>{window.windowTab.createdAt.split("T")[0]}</span>
         </div>

         <div className='flex items-center space-x-1'>
            <PiNotePencilThin className='text-base text-custom-color-title font-bold' /> <span className='text-xs font-medium text-center'>{window.windowTab.note}</span>
         </div>

         <ListTab window={window} />
      </div>
   );
}

export default WindowCollection;

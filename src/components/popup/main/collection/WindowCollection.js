/** @format */

import React, { useRef, useState, lazy, useEffect } from "react";
import serviceChrome from "../../../services/ServiceChrome";
import { useDispatch, useSelector } from "react-redux";
import servicePopup from "../../servicePopup";
import { IoCloseOutline } from "react-icons/io5";
import { Tooltip, Zoom } from "@mui/material";
import { ActionTab } from "../../../../enums/action";
import { deleteCollection, updateCollection } from "../../../../store/features/windowSlices";
import { addNoti, updateAuth } from "../../../../store/features/popupSlices";
import { AnimatePresence, motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
const ListTab = lazy(() => import("../common/ListTab"));
/* global chrome */

function WindowCollection({ window }) {
   const dispatch = useDispatch();
   const [updateCollectionState, setUpdateCollectionState] = useState(false);
   const [title, setTitle] = useState(window.windowTab.title);

   useEffect(() => {
      setTitle(window.windowTab.title);
   }, [window.windowTab.title]);

   const updateCollectionName = async (title, collectionId) => {
      const response = await servicePopup.updateCollection(title, collectionId);
      if (response === null) {
         dispatch(updateAuth(false));
         dispatch(addNoti({ message: "session expire, please login again", id: uuidv4(), status: 401 }));
      } else {
         const { data, status, message } = response.data;
         serviceChrome.sendMessage({ data: data }, ActionTab.typeUpdateCollection);
         dispatch(updateCollection({ data: data }));
         dispatch(addNoti({ id: uuidv4(), status, message }));
      }
   };

   const handleDeleteCollection = async (id) => {
      const response = await servicePopup.deleteCollection(id);
      if (response === null) {
         dispatch(updateAuth(false));
         dispatch(addNoti({ message: "session expire, please login again", id: uuidv4(), status: 401 }));
      } else {
         const { data, status, message } = response.data;
         serviceChrome.sendMessage({ collection: data }, ActionTab.typeDeleteCollection);
         dispatch(deleteCollection({ collection: data }));
         dispatch(addNoti({ id: uuidv4(), status, message }));
      }
   };

   return (
      <div className='transition duration-200 ease-in space-y-2 hover:-translate-y-1 bg-white p-2 hover:shadow-custom-hover cursor-pointer shadow-custom rounded-md z-10 will-change-transform will-change-shadow'>
         <div className='flex justify-between items-center'>
            <div className='h-8 flex items-center space-x-2'>
               <span
                  onMouseEnter={() => setUpdateCollectionState(true)}
                  onMouseLeave={(e) => {
                     if (window.windowTab.title !== title) {
                        updateCollectionName(title, window.windowTab.id);
                     }
                     setUpdateCollectionState(false);
                  }}
                  className='relative flex items-center'>
                  <AnimatePresence mode='wait'>
                     {!updateCollectionState ? (
                        <motion.span
                           key='span'
                           style={{ maxWidth: "100px" }}
                           className='text-custom-color-title overflow-hidden text-xs font-semibold cursor-pointer text-ellipsis whitespace-nowrap'
                           initial={{ opacity: 0, scale: 0.8, x: -20 }}
                           animate={{ opacity: 1, scale: 1, x: 0 }}
                           exit={{ opacity: 0, scale: 0.8 }}
                           transition={{ duration: 0.3, ease: "easeInOut" }}>
                           #{window.windowTab.title}
                        </motion.span>
                     ) : (
                        <Tooltip disableInteractive TransitionComponent={Zoom} TransitionProps={{ timeout: 200 }} title={title}>
                           <motion.div
                              key='input-container'
                              className='relative'
                              initial={{ width: 0 }}
                              animate={{ width: "100px" }}
                              exit={{ width: 0 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              style={{ overflow: "hidden", display: "flex", alignItems: "center" }}>
                              <motion.input
                                 type='text'
                                 value={title}
                                 onChange={(e) => {
                                    setTitle(e.target.value);
                                 }}
                                 onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                       updateCollectionName(title, window.windowTab.id);
                                    }
                                 }}
                                 className='border cursor-pointer transition-all text-xs pb-1 border-gray-200 rounded-sm focus:outline-none h-full'
                                 initial={{ opacity: 0 }}
                                 animate={{ width: "100px", opacity: 1 }}
                                 exit={{ width: "30px", opacity: 0 }}
                                 transition={{ duration: 0.2 }}
                                 style={{ boxSizing: "border-box", lineHeight: "1.5", borderTop: "none", borderLeft: "none", borderRight: "none" }}
                              />
                           </motion.div>
                        </Tooltip>
                     )}
                  </AnimatePresence>
               </span>

               <span className='text-xs font-medium text-center'>{window.windowTab.length > 1 ? `(${window.windowTab.length} tabs)` : "(1 tab)"}</span>
            </div>
            <Tooltip disableInteractive TransitionComponent={Zoom} TransitionProps={{ timeout: 200 }} title={"Close collection"}>
               <div
                  onClick={() => {
                     handleDeleteCollection(window.windowTab.id);
                  }}
                  className='flex items-center justify-center p-1 bg-gray-300 rounded-full cursor-pointer hover:bg-custom-pink transition duration-300 ease-in-out'>
                  <IoCloseOutline className='text-xs text-white transition-transform duration-300 ease-in-out transform rotate-0' />
               </div>
            </Tooltip>
         </div>

         <ListTab window={window} />
      </div>
   );
}

export default WindowCollection;

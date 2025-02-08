/** @format */

import { SlClose } from "react-icons/sl";
import { CiSaveDown1 } from "react-icons/ci";
import { useSelector, useDispatch } from "react-redux";
import servicesChrome from "../../services/ServiceChrome";
import { Tooltip, Zoom } from "@mui/material";
import { Grid2 } from "@mui/material";
import { CiGrid2H } from "react-icons/ci";
import { CiGrid41 } from "react-icons/ci";
import { updatePinTab, updateStateDisplay } from "../../../store/features/popupSlices";
import { GoPin } from "react-icons/go";
import React, { useState, useRef } from "react";
import { updateStateCollection } from "../../../store/features/popupSlices";
import { ActionTab } from "../../../enums/action";
import { BsCollection } from "react-icons/bs";
import { AnimatePresence, motion } from "framer-motion";

/* global chrome */

function TaskBarPopup({ filterGroupTab, groupTab }) {
   const dispatch = useDispatch();
   const timeoutRef = useRef(null);
   const windowCurrent = useSelector((state) => state.current.value);
   const typeDisplay = useSelector((state) => state.current.displayState);
   const typeDisplayCollection = useSelector((state) => state.current.displayCollection);
   const pinState = useSelector((state) => state.current.pinTab);
   const [valueFilter, setValueFilter] = useState("");
   const [isFocused, setIsFocused] = useState(false);
   const [titleDisplayCollection, setTitleDisplayCollection] = useState(ActionTab.typeStateOpenCollection);

   const minimizeWindow = (windowCurrentId) => {
      servicesChrome.minimizeWindow(windowCurrentId);
   };

   const openCollection = (value, state) => {
      dispatch(updateStateCollection(!value));
      servicesChrome.setStateLocal(ActionTab.typeChangeStateCollection, !value);
      servicesChrome.sendMessage({ state: !value }, ActionTab.typeChangeStateCollection);
      setTitleDisplayCollection(state);
   };

   const pinTabWindowCurrent = () => {
      servicesChrome.pinTab();
   };

   const updateStatePopup = (display) => {
      dispatch(updateStateDisplay(display));
      servicesChrome.setStateLocal(process.env.REACT_APP_TYPE_NAME_VIEW_VARIABLE, display);
      servicesChrome.sendMessage({ display }, ActionTab.typeChangeState);
   };

   const changeState = () => {
      switch (typeDisplay) {
         case process.env.REACT_APP_TYPE_TAB_BLOCK:
            updateStatePopup(process.env.REACT_APP_TYPE_TAB_HORIZONTAL);
            break;
         case process.env.REACT_APP_TYPE_TAB_HORIZONTAL:
            updateStatePopup(process.env.REACT_APP_TYPE_TAB_BLOCK);
            break;
      }
   };

   return (
      <div className='p-1'>
         <Grid2 columns={{ xs: 6, sm: 6, md: 6 }} container spacing={1}>
            <Grid2 size={{ xs: 4, sm: 4, md: 4 }}>
               <div className='flex h-full items-center space-x-2'>
                  <div className='relative w-full'>
                     <input
                        onChange={(e) => {
                           filterGroupTab(e.target.value);
                           setValueFilter(e.target.value);
                        }}
                        onKeyDown={(e) => {
                           if (e.key === "Enter") {
                              groupTab(e.target.value);
                           }
                        }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        value={valueFilter}
                        className={`w-full outline-none border-none p-1 text-sm placeholder:text-sm`}
                        placeholder='You can type tabs by title or URL'
                     />
                     <motion.span
                        className='absolute left-0 bottom-0 w-full h-[1.5px] bg-gray-300'
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: isFocused ? 1 : 0 }}
                        transition={{
                           duration: 0.5,
                           ease: [0.25, 0.46, 0.45, 0.94],
                           delay: isFocused ? 0.05 : 0,
                        }}
                        style={{ transformOrigin: "left" }}
                     />
                  </div>
                  <button
                     onClick={(e) => {
                        groupTab(valueFilter);
                     }}
                     disabled={valueFilter === ""}
                     className={`h-full ${valueFilter === "" ? "opacity-70" : "hover:bg-gray-200"} bg-gray-100 text-black rounded p-2 text-xs transition duration-200`}>
                     Filter
                  </button>
               </div>
            </Grid2>

            <Grid2 size={{ xs: 2, sm: 2, md: 2 }}>
               <Grid2 columns={{ xs: 4, sm: 4, md: 4 }} container spacing={1}>
                  <Grid2 size={{ xs: 1, sm: 1, md: 1 }}>
                     <Tooltip
                        onClick={(e) => {
                           e.stopPropagation();
                           openCollection(typeDisplayCollection, typeDisplayCollection ? ActionTab.typeStateOpenCollection : ActionTab.typeStateCloseCollection);
                        }}
                        title={titleDisplayCollection}
                        TransitionComponent={Zoom}
                        TransitionProps={{ timeout: 250 }}
                        disableInteractive>
                        <div className='cursor-pointer flex items-center h-full border-1 border-opacity-5 p-2 rounded hover:bg-gray-200 text-base transition duration-200 ease-in-out'>
                           <BsCollection className='w-full' />
                        </div>
                     </Tooltip>
                  </Grid2>

                  <Grid2 size={{ xs: 1, sm: 1, md: 1 }}>
                     <Tooltip
                        onClick={(e) => {
                           e.stopPropagation();
                           minimizeWindow(windowCurrent);
                        }}
                        title={"Minimize this window"}
                        TransitionComponent={Zoom}
                        TransitionProps={{ timeout: 250 }}
                        disableInteractive>
                        <div className='cursor-pointer flex items-center h-full border-1 border-opacity-5 p-2 rounded hover:bg-gray-200 text-base transition duration-200 ease-in-out'>
                           <CiSaveDown1 className='w-full' />
                        </div>
                     </Tooltip>
                  </Grid2>

                  <Grid2 size={{ xs: 1, sm: 1, md: 1 }}>
                     <Tooltip
                        onClick={(e) => {
                           e.stopPropagation();
                           changeState();
                        }}
                        title={"Change block view"}
                        TransitionComponent={Zoom}
                        TransitionProps={{ timeout: 250 }}
                        disableInteractive>
                        <div className='cursor-pointer flex items-center h-full border-1 border-opacity-5 p-2 rounded hover:bg-gray-200 text-base transition duration-200 ease-in-out'>
                           {typeDisplay === process.env.REACT_APP_TYPE_TAB_HORIZONTAL ? <CiGrid41 className='w-full' /> : <CiGrid2H className='w-full' />}
                        </div>
                     </Tooltip>
                  </Grid2>

                  <Grid2 size={{ xs: 1, sm: 1, md: 1 }}>
                     <Tooltip
                        onClick={(e) => {
                           e.stopPropagation();
                           pinTabWindowCurrent();
                           dispatch(updatePinTab(!pinState));
                        }}
                        title={pinState ? "Unpin tab current" : "Pin tab current"}
                        TransitionComponent={Zoom}
                        TransitionProps={{ timeout: 250 }}
                        disableInteractive>
                        <div className='cursor-pointer flex items-center h-full border-1 border-opacity-5 p-2 rounded hover:bg-gray-200 text-base transition duration-200 ease-in-out'>
                           <GoPin className='w-full' />
                        </div>
                     </Tooltip>
                  </Grid2>
               </Grid2>
            </Grid2>
         </Grid2>
      </div>
   );
}

export default TaskBarPopup;

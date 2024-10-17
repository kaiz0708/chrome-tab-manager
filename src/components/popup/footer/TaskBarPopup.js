/** @format */

import { SlClose } from "react-icons/sl";
import { CiSaveDown1 } from "react-icons/ci";
import { useSelector, useDispatch } from "react-redux";
import servicesChrome from "../../services/ServiceChrome";
import { Tooltip, Zoom } from "@mui/material";
import { Grid2 } from "@mui/material";
import { CiGrid2H } from "react-icons/ci";
import { CiGrid41 } from "react-icons/ci";
import { updateStateDisplay } from "../../../store/features/popupSlices";
import { GoPin } from "react-icons/go";
import React, { useState } from "react";
import { updateStateCollection } from "../../../store/features/popupSlices";
import { ActionTab } from "../../../enums/action";
import { BsCollection } from "react-icons/bs";

/* global chrome */

function TaskBarPopup({ filterGroupTab, groupTab }) {
   const dispatch = useDispatch();
   const windowCurrent = useSelector((state) => state.current.value);
   const typeDisplay = useSelector((state) => state.current.displayState);
   const typeDisplayCollection = useSelector((state) => state.current.displayCollection);
   const [valueFilter, setValueFilter] = useState("");
   const pinTab = useSelector((state) => state.current.pinTab);
   const [titleDisplayCollection, setTitleDisplayCollection] = useState(ActionTab.typeStateOpenCollection);

   const minimizeWindow = (windowCurrentId) => {
      servicesChrome.minimizeWindow(windowCurrentId);
   };

   const openCollection = (value, state) => {
      dispatch(updateStateCollection(!value));
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
                  <input
                     onChange={(e) => {
                        filterGroupTab(e.target.value);
                        setValueFilter(e.target.value);
                     }}
                     onKeyDown={(e) => {
                        if (e.key === "Enter") {
                           groupTab(e.target.value);
                           setValueFilter("");
                        }
                     }}
                     value={valueFilter}
                     className='w-full outline-none focus:ring-0 border-none rounded p-1.5 text-sm placeholder:text-sm'
                     placeholder='Filtering follow title or url....'
                  />
                  <button
                     onClick={(e) => {
                        groupTab(e.target.value);
                        setValueFilter("");
                     }}
                     className='h-full bg-gray-100 text-black rounded p-2 text-xs'>
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
                        TransitionProps={{ timeout: 200 }}
                        disableInteractive>
                        <div className='cursor-pointer flex items-center h-full border-1 border-opacity-5 p-2 rounded hover:bg-gray-100 text-base transition duration-300 ease-in-out'>
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
                        TransitionProps={{ timeout: 200 }}
                        disableInteractive>
                        <div className='cursor-pointer flex items-center h-full border-1 border-opacity-5 p-2 rounded hover:bg-gray-100 text-base transition duration-300 ease-in-out'>
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
                        TransitionProps={{ timeout: 200 }}
                        disableInteractive>
                        <div className='cursor-pointer flex items-center h-full border-1 border-opacity-5 p-2 rounded hover:bg-gray-100 text-base transition duration-300 ease-in-out'>
                           {typeDisplay === process.env.REACT_APP_TYPE_TAB_HORIZONTAL ? <CiGrid41 className='w-full' /> : <CiGrid2H className='w-full' />}
                        </div>
                     </Tooltip>
                  </Grid2>

                  <Grid2 size={{ xs: 1, sm: 1, md: 1 }}>
                     <Tooltip
                        onClick={(e) => {
                           e.stopPropagation();
                           pinTabWindowCurrent();
                        }}
                        title={"Pin current tab this window"}
                        TransitionComponent={Zoom}
                        TransitionProps={{ timeout: 200 }}
                        disableInteractive>
                        <div className='cursor-pointer flex items-center h-full border-1 border-opacity-5 p-2 rounded hover:bg-gray-100 text-base transition duration-300 ease-in-out'>
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

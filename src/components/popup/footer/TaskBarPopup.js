/** @format */

import { LuFilePlus2 } from "react-icons/lu";
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
import React from "react";
import { updateStateCollection } from "../../../store/features/popupSlices";

/* global chrome */

function TaskBarPopup({ filterGroupTab, groupTab }) {
   const dispatch = useDispatch();
   const windowCurrent = useSelector((state) => state.current.value);
   const typeDisplay = useSelector((state) => state.current.displayState);
   const typeDisplayCollection = useSelector((state) => state.current.displayCollection);

   const minimizeWindow = (windowCurrentId) => {
      servicesChrome.minimizeWindow(windowCurrentId);
   };

   const openCollection = () => {
      typeDisplayCollection ? dispatch(updateStateCollection(false)) : dispatch(updateStateCollection(true));
   };

   const pinTabWindowCurrent = () => {
      servicesChrome.pinTab();
   };

   const openNewWindowEmpty = () => {
      servicesChrome.openWindow("chrome://newtab");
   };

   const changeState = () => {
      switch (typeDisplay) {
         case process.env.REACT_APP_TYPE_TAB_BLOCK:
            dispatch(updateStateDisplay(process.env.REACT_APP_TYPE_TAB_HORIZONTAL));
            servicesChrome.setStateLocal(process.env.REACT_APP_TYPE_NAME_VIEW_VARIABLE, process.env.REACT_APP_TYPE_TAB_HORIZONTAL);
            break;
         case process.env.REACT_APP_TYPE_TAB_HORIZONTAL:
            dispatch(updateStateDisplay(process.env.REACT_APP_TYPE_TAB_BLOCK));
            servicesChrome.setStateLocal(process.env.REACT_APP_TYPE_NAME_VIEW_VARIABLE, process.env.REACT_APP_TYPE_TAB_BLOCK);
            break;
         default:
            break;
      }
   };

   return (
      <div className='p-2'>
         <Grid2 columns={{ xs: 6, sm: 6, md: 6 }} container spacing={0.5}>
            <Grid2 size={{ xs: 4, sm: 4, md: 4 }}>
               <div className='h-full'>
                  <input
                     onChange={(e) => {
                        filterGroupTab(e.target.value);
                     }}
                     onKeyDown={(e) => {
                        if (e.key === "Enter") {
                           groupTab();
                        }
                     }}
                     className='w-full h-full focus:outline-none border border-gray-200 rounded p-1.5 text-sm placeholder:text-sm'
                     placeholder='Start typing to search tabs....'
                  />
               </div>
            </Grid2>

            <Grid2 size={{ xs: 2, sm: 2, md: 2 }}>
               <Grid2 columns={{ xs: 5, sm: 5, md: 5 }} container spacing={0.5}>
                  <Grid2 size={{ xs: 1, sm: 1, md: 1 }}>
                     <Tooltip
                        onClick={(e) => {
                           e.stopPropagation();
                           openNewWindowEmpty();
                        }}
                        title={"Open new tab"}
                        TransitionComponent={Zoom}
                        TransitionProps={{ timeout: 200 }}
                        disableInteractive>
                        <div className='h-full aspect-square cursor-pointer border-1 border-opacity-5 p-2 rounded hover:bg-gray-100 text-base transition duration-300 ease-in-out'>
                           <LuFilePlus2 className='w-full h-full' />
                        </div>
                     </Tooltip>
                  </Grid2>

                  <Grid2 size={{ xs: 1, sm: 1, md: 1 }}>
                     <Tooltip
                        onClick={(e) => {
                           e.stopPropagation();
                           openCollection();
                        }}
                        title={"Close this popup"}
                        TransitionComponent={Zoom}
                        TransitionProps={{ timeout: 200 }}
                        disableInteractive>
                        <div className='h-full aspect-square cursor-pointer border-1 border-opacity-5 p-2 rounded hover:bg-gray-100 text-base transition duration-300 ease-in-out'>
                           <SlClose className='w-full h-full' />
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
                        <div className='h-full aspect-square cursor-pointer border-1 border-opacity-5 p-2 rounded hover:bg-gray-100 text-base transition duration-300 ease-in-out'>
                           <CiSaveDown1 className='w-full h-full' />
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
                        <div className='h-full aspect-square cursor-pointer border-1 border-opacity-5 p-2 rounded hover:bg-gray-100 text-base transition duration-300 ease-in-out'>
                           {typeDisplay === process.env.REACT_APP_TYPE_TAB_HORIZONTAL ? <CiGrid41 className='w-full h-full' /> : <CiGrid2H className='w-full h-full' />}
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
                        <div className='h-full aspect-square cursor-pointer border-1 border-opacity-5 p-2 rounded hover:bg-gray-100 text-base transition duration-300 ease-in-out'>
                           <GoPin className='w-full h-full' />
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

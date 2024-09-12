/** @format */

import { LuFilePlus2 } from "react-icons/lu";
import { SlClose } from "react-icons/sl";
import { CiSaveDown1 } from "react-icons/ci";
import { useSelector, useDispatch } from "react-redux";
import servicesChrome from "../services/ServiceChrome";
import { Grid2, Tooltip, Zoom } from "@mui/material";
import { CiGrid2H } from "react-icons/ci";
import { CiGrid41 } from "react-icons/ci";
import { updateStateDisplay } from "../../store/features/popupSlices";

/* global chrome */

function TaskBarPopup() {
   const dispatch = useDispatch();
   const windowCurrent = useSelector((state) => state.current.value);
   const typeDisplay = useSelector((state) => state.current.displayState);

   const minimizeWindow = (windowCurrentId) => {
      servicesChrome.minimizeWindow(windowCurrentId);
   };

   const switchToWindow = (windowCurrent) => {
      servicesChrome.switchToWindow(windowCurrent);
   };

   const openNewWindowEmpty = () => {
      servicesChrome.openWindow();
   };

   const changeState = () => {
      switch (typeDisplay) {
         case process.env.REACT_APP_TYPE_TAB_BLOCK:
            dispatch(
               updateStateDisplay(process.env.REACT_APP_TYPE_TAB_HORIZONTAL)
            );
            break;
         case process.env.REACT_APP_TYPE_TAB_HORIZONTAL:
            dispatch(updateStateDisplay(process.env.REACT_APP_TYPE_TAB_BLOCK));
            break;
         default:
            break;
      }
   };
   return (
      <Grid2 columns={{ xs: 6, sm: 6, md: 6 }} container spacing={0.5}>
         <Grid2 size={{ xs: 4, sm: 4, md: 4 }}>
            <div className='h-full'>
               <input
                  className='w-full h-full focus:outline-none border border-gray-200 rounded p-1.5 text-sm placeholder:text-sm'
                  placeholder='Starting searching tabs....'
               />
            </div>
         </Grid2>

         <Grid2 size={{ xs: 2, sm: 2, md: 2 }}>
            <Grid2 columns={{ xs: 5, sm: 5, md: 5 }} container spacing={0.5}>
               <Grid2 size={{ xs: 1, sm: 1, md: 1 }}>
                  <Tooltip
                     title={"Open new tab"}
                     TransitionComponent={Zoom}
                     TransitionProps={{ timeout: 200 }}
                     disableInteractive>
                     <div className='h-full aspect-square cursor-pointer border-1 border-opacity-5 p-2 rounded hover:bg-gray-100 text-base transition duration-300 ease-in-out'>
                        <LuFilePlus2
                           onClick={(e) => {
                              e.stopPropagation();
                              openNewWindowEmpty();
                           }}
                           className='text-xl'
                        />
                     </div>
                  </Tooltip>
               </Grid2>

               <Grid2 size={{ xs: 1, sm: 1, md: 1 }}>
                  <Tooltip
                     title={"Close this popup"}
                     TransitionComponent={Zoom}
                     TransitionProps={{ timeout: 200 }}
                     disableInteractive>
                     <div className='h-full aspect-square cursor-pointer border-1 border-opacity-5 p-2 rounded hover:bg-gray-100 text-base transition duration-300 ease-in-out'>
                        <SlClose
                           onClick={(e) => {
                              e.stopPropagation();
                              switchToWindow(windowCurrent);
                           }}
                           className='text-xl'
                        />
                     </div>
                  </Tooltip>
               </Grid2>

               <Grid2 size={{ xs: 1, sm: 1, md: 1 }}>
                  <Tooltip
                     title={"Minimize this window"}
                     TransitionComponent={Zoom}
                     TransitionProps={{ timeout: 200 }}
                     disableInteractive>
                     <div
                        onClick={(e) => {
                           e.stopPropagation();
                           minimizeWindow(windowCurrent);
                        }}
                        className='h-full aspect-square cursor-pointer border-1 border-opacity-5 p-2 rounded hover:bg-gray-100 text-base transition duration-300 ease-in-out'>
                        <CiSaveDown1 className='text-xl' />
                     </div>
                  </Tooltip>
               </Grid2>

               <Grid2 size={{ xs: 1, sm: 1, md: 1 }}>
                  <Tooltip
                     title={"Change block view"}
                     TransitionComponent={Zoom}
                     TransitionProps={{ timeout: 200 }}
                     disableInteractive>
                     <div
                        onClick={(e) => {
                           e.stopPropagation();
                           changeState();
                        }}
                        className='h-full aspect-square cursor-pointer border-1 border-opacity-5 p-2 rounded hover:bg-gray-100 text-base transition duration-300 ease-in-out'>
                        {typeDisplay ===
                        process.env.REACT_APP_TYPE_TAB_HORIZONTAL ? (
                           <CiGrid41 className='text-xl' />
                        ) : (
                           <CiGrid2H className='text-xl' />
                        )}
                     </div>
                  </Tooltip>
               </Grid2>
            </Grid2>
         </Grid2>
      </Grid2>
   );
}

export default TaskBarPopup;

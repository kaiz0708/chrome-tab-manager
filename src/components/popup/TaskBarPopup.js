/** @format */

import { LuFilePlus2 } from "react-icons/lu";
import { SlClose } from "react-icons/sl";
import { CiSaveDown1 } from "react-icons/ci";
import { useSelector, useDispatch } from "react-redux";
import servicesChrome from "../services/ServiceChrome";

/* global chrome */

function TaskBarPopup() {
   const windowCurrent = useSelector((state) => state.current.value);

   const minimizeWindow = (windowCurrentId) => {
      servicesChrome.minimizeWindow(windowCurrentId);
   };

   const switchToWindow = (windowCurrent) => {
      servicesChrome.switchToWindow(windowCurrent);
   };

   const openNewWindowEmpty = () => {
      servicesChrome.openWindow();
   };
   return (
      <div className='z-10 p-2 flex justify-between items-center'>
         <div className='w-[90%]'>
            <input
               className='w-full h-full focus:outline-none border border-gray-200 rounded p-1.5 text-sm placeholder:text-sm'
               placeholder='Starting searching tabs....'
            />
         </div>

         <div className='flex gap-1.5'>
            <div className='cursor-pointer border-1 border-opacity-5 p-1 rounded hover:text-white hover:bg-custom-pink text-base transition duration-300 ease-in-out'>
               <LuFilePlus2
                  onClick={(e) => {
                     e.stopPropagation();
                     openNewWindowEmpty();
                  }}
                  className='text-xl'
               />
            </div>
            <div className='cursor-pointer border-1 border-opacity-5 p-1 rounded hover:text-white hover:bg-custom-pink text-base transition duration-300 ease-in-out'>
               <SlClose
                  onClick={(e) => {
                     e.stopPropagation();
                     switchToWindow(windowCurrent);
                  }}
                  className='text-xl'
               />
            </div>
            <div
               onClick={(e) => {
                  e.stopPropagation();
                  minimizeWindow(windowCurrent);
               }}
               className='cursor-pointer border-1 border-opacity-5 p-1 rounded hover:text-white hover:bg-custom-pink text-base transition duration-300 ease-in-out'>
               <CiSaveDown1 className='text-xl' />
            </div>
         </div>
      </div>
   );
}

export default TaskBarPopup;

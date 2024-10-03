/** @format */
import { useDrag, useDrop } from "react-dnd";
import serviceChrome from "../../services/ServiceChrome";
import React, { useEffect, useRef, lazy, Suspense } from "react";
import { Tooltip, Zoom } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { AnimatePresence } from "framer-motion";
import { CircularProgress } from "@mui/material";
import { ActionTab } from "../../../enums/ActionTab";
import Masonry from "@mui/lab/Masonry";
import { Box } from "@mui/material";
import { HiOutlinePlus } from "react-icons/hi2";

const MainCollections = lazy(() => import("./MainCollections"));
/* global chrome */

const WindowTab = lazy(() => import("./WindowTab"));

function MainPopup({ windowTabs, typeDisplay, loadingCollection }) {
   const dropRef = useRef(null);
   const type = process.env.REACT_APP_TYPE_TAB;
   const stateCollection = useSelector((state) => state.current.displayCollection);
   const tabType = process.env.REACT_APP_TYPE_TAB;
   const collectionType = process.env.REACT_APP_TYPE_COLLECTION;

   const [{ isOver }, drop] = useDrop({
      accept: "ITEM",
      drop: (item, monitor) => {
         const { tab, index } = item;
         if (monitor.didDrop()) {
            return;
         }
         if (item.display === tabType) {
            serviceChrome.openWindowGroup([tab]);
         } else {
            serviceChrome.sendMessage({ idCollection: tab.id, index }, ActionTab.typeDeleteCollection);
            serviceChrome.openWindow(tab.url);
         }
      },
      collect: (monitor) => ({
         isOver: !!monitor.isOver(),
      }),
   });

   const combinedRef = (el) => {
      dropRef.current = el;
      drop(el);
   };

   const openNewWindowEmpty = () => {
      serviceChrome.openWindow("chrome://newtab");
   };

   return (
      <div className='h-custom'>
         <div ref={combinedRef} className={`p-2 ${stateCollection ? "h-[50%]" : "h-full"} relative bg-gray-100 overflow-y-auto scrollbar-thumb-rounded`}>
            <Masonry columns={3} spacing={1}>
               {windowTabs.map((windowTab, index) => (
                  <Box key={index} sx={{ height: "auto" }}>
                     <WindowTab
                        window={{
                           windowTab,
                           index,
                           typeDisplay: typeDisplay,
                           typeFeature: type,
                        }}
                     />
                  </Box>
               ))}

               <Box key={windowTabs.length} sx={{ height: "auto" }}>
                  <Tooltip
                     onClick={(e) => {
                        e.stopPropagation();
                        openNewWindowEmpty();
                     }}
                     title={"Open new window"}
                     TransitionComponent={Zoom}
                     TransitionProps={{ timeout: 200 }}
                     disableInteractive>
                     <div className='transition h-customBlock duration-200 ease-in space-y-2 hover:-translate-y-1 bg-white p-2 hover:shadow-custom-hover cursor-pointer shadow-custom rounded-md z-10 will-change-transform will-change-shadow flex justify-center items-center'>
                        <HiOutlinePlus className='size-8' />
                     </div>
                  </Tooltip>
               </Box>
            </Masonry>
         </div>

         <div className={`relative border-1 p-2 text-black overflow-y-auto scrollbar-thumb-rounded ${stateCollection ? "h-[50%]" : "overflow hidden"}`}>
            {stateCollection ? (
               loadingCollection ? (
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                     <CircularProgress aria-label='Loading....' aria-busy={loadingCollection ? "true" : "false"} aria-live='polite' />
                  </div>
               ) : (
                  <Suspense>
                     <AnimatePresence>
                        <MainCollections />
                     </AnimatePresence>
                  </Suspense>
               )
            ) : null}
         </div>
      </div>
   );
}

export default MainPopup;

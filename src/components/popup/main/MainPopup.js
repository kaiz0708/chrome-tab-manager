/** @format */
import { useDrag, useDrop } from "react-dnd";
import serviceChrome from "../../services/ServiceChrome";
import React, { useEffect, useRef, lazy, Suspense } from "react";
import { Grid2, Tooltip, Zoom } from "@mui/material";
import Collection from "./Collections";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
/* global chrome */

const WindowTab = lazy(() => import("./WindowTab"));

function MainPopup({ windowTabs, typeDisplay }) {
   const dropRef = useRef(null);
   const forTab = useRef(true);
   const stateCollection = useSelector((state) => state.current.displayCollection);

   const [{ isOver }, drop] = useDrop({
      accept: "ITEM",
      drop: (item, monitor) => {
         if (monitor.didDrop()) {
            return;
         }
         serviceChrome.openWindowGroup([item.tab]);
      },
      collect: (monitor) => ({
         isOver: !!monitor.isOver(),
      }),
   });

   const combinedRef = (el) => {
      dropRef.current = el;
      drop(el);
   };
   return (
      <div className='p-2 h-custom'>
         <div ref={combinedRef} className={`p-2 ${stateCollection ? "h-[50%]" : "h-full"} relative bg-gray-100 overflow-y-auto scrollbar-thumb-rounded`}>
            <Grid2 spacing={1} columns={{ xs: 3, sm: 3, md: 3 }} container>
               {windowTabs.map((windowTab, index) => (
                  <Grid2 size={{ xs: 1, sm: 1, md: 1 }} key={index}>
                     <Suspense>
                        <WindowTab
                           window={{
                              windowTab,
                              index,
                              typeDisplay: typeDisplay,
                              for: forTab.current,
                           }}
                        />
                     </Suspense>
                  </Grid2>
               ))}
            </Grid2>
         </div>

         <div className={`relative border-1 p-2 text-black overflow-y-auto scrollbar-thumb-rounded ${stateCollection ? "h-[50%]" : "overflow hidden"}`}>
            <AnimatePresence>{stateCollection ? <Collection /> : null}</AnimatePresence>
         </div>
      </div>
   );
}

export default MainPopup;

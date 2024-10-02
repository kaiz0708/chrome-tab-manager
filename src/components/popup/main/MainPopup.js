/** @format */
import { useDrag, useDrop } from "react-dnd";
import serviceChrome from "../../services/ServiceChrome";
import React, { useEffect, useRef, lazy, Suspense } from "react";
import { Grid2, Tooltip, Zoom } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { CircularProgress } from "@mui/material";
import Typography from "@mui/material/Typography";
import { ActionTab } from "../../../enums/ActionTab";
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
                              typeFeature: type,
                           }}
                        />
                     </Suspense>
                  </Grid2>
               ))}
            </Grid2>
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

/** @format */

import React, { useState, useRef, useEffect, Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { useDrag, useDrop } from "react-dnd";
import serviceChrome from "../../services/ServiceChrome";
import { useDispatch, useSelector } from "react-redux";
import { Grid2 } from "@mui/material";
const WindowTab = lazy(() => import("./WindowTab"));
/* global chrome */

function MainCollections() {
   const dropRef = useRef(null);
   const windowTabs = useSelector((state) => state.window.collection);
   const type = process.env.REACT_APP_TYPE_COLLECTION;
   const typeDisplay = useSelector((state) => state.current.displayState);

   const [{ isOver }, drop] = useDrop({
      accept: "ITEM",
      drop: (item, monitor) => {
         if (monitor.didDrop()) {
            return;
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
      <motion.div ref={combinedRef} initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }} transition={{ duration: 0.3 }}>
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
      </motion.div>
   );
}

export default MainCollections;

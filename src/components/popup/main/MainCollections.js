/** @format */

import React, { useState, useRef, useEffect, Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { useDrag, useDrop } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import { Grid2 } from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import { Box } from "@mui/material";
import servicePopup from "../servicePopup";
import { setValueCollection } from "../../../store/features/windowSlices";
import { Tooltip, Zoom } from "@mui/material";
import { HiOutlinePlus } from "react-icons/hi2";
import { CircularProgress } from "@mui/material";
const WindowTab = lazy(() => import("./WindowTab"));
/* global chrome */

function MainCollections() {
   const [loading, setLoading] = useState(true);
   const dropRef = useRef(null);
   const dispatch = useDispatch();
   const windowTabs = useSelector((state) => state.window.collection);
   const type = process.env.REACT_APP_TYPE_COLLECTION;
   const typeDisplay = useSelector((state) => state.current.displayState);
   const tabType = process.env.REACT_APP_TYPE_TAB;
   const collectionType = process.env.REACT_APP_TYPE_COLLECTION;

   useEffect(() => {
      const getListCollection = async () => {
         const response = await servicePopup.listCollection();
         const { data } = response.data;
         dispatch(setValueCollection(data));
      };

      getListCollection().then(() => setLoading(false));
   }, []);

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
      <div>
         {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
               <CircularProgress aria-label='Loading....' aria-busy={loading ? "true" : "false"} aria-live='polite' />
            </div>
         ) : (
            <motion.div ref={combinedRef} initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }} transition={{ duration: 0.3 }}>
               <Grid2 spacing={1} columns={{ xs: 3, sm: 3, md: 3 }} container>
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
                           }}
                           title={"New collection"}
                           TransitionComponent={Zoom}
                           TransitionProps={{ timeout: 200 }}
                           disableInteractive>
                           <div className='transition h-customBlock duration-200 ease-in space-y-2 hover:-translate-y-1 bg-white p-2 hover:shadow-custom-hover cursor-pointer shadow-custom rounded-md z-10 will-change-transform will-change-shadow flex justify-center items-center'>
                              <HiOutlinePlus className='size-8' />
                           </div>
                        </Tooltip>
                     </Box>
                  </Masonry>
               </Grid2>
            </motion.div>
         )}
      </div>
   );
}

export default MainCollections;

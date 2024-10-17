/** @format */

import React, { useState, useRef, useEffect, Suspense, lazy } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDrag, useDrop } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import { Grid2 } from "@mui/material";
import { Box } from "@mui/material";
import { setValueCollection, createCollection } from "../../../../store/features/windowSlices";
import Masonry from "react-masonry-css";
import { Tooltip, Zoom } from "@mui/material";
import { HiOutlinePlus } from "react-icons/hi2";
import { CircularProgress } from "@mui/material";
import servicePopup from "../../servicePopup";
import serviceChrome from "../../../services/ServiceChrome";
import { ActionTab } from "../../../../enums/action";
import { addNoti, updateAuth } from "../../../../store/features/popupSlices";
import { v4 as uuidv4 } from "uuid";
const WindowCollection = lazy(() => import("../collection/WindowCollection"));
/* global chrome */

function MainCollections() {
   const [loading, setLoading] = useState(true);
   const dropRef = useRef(null);
   const dispatch = useDispatch();
   const windowTabs = useSelector((state) => state.window.collection);
   const type = process.env.REACT_APP_TYPE_COLLECTION;
   const typeDisplay = useSelector((state) => state.current.displayState);
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

   const handleCreateCollection = async (windowCollectionLength) => {
      const title = process.env.REACT_APP_TYPE_DEFAULT_NAME_COLLECTION + "_" + windowCollectionLength;
      const response = await servicePopup.createCollection(title);
      if (response === null) {
         dispatch(updateAuth(false));
         dispatch(addNoti({ message: "session expire, please login again", id: uuidv4(), status: 401 }));
      } else {
         const { data, status, message } = response.data;
         serviceChrome.sendMessage({ collection: data }, ActionTab.typeCreateCollection);
         dispatch(createCollection({ collection: data }));
         dispatch(addNoti({ id: uuidv4(), status, message }));
      }
   };

   return (
      <div>
         {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
               <CircularProgress aria-label='Loading....' aria-busy={loading ? "true" : "false"} aria-live='polite' />
            </div>
         ) : (
            <motion.div ref={combinedRef} initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 0, opacity: 20 }} transition={{ duration: 0.3 }}>
               <div className='mb-2'>
                  <Grid2 columns={{ xs: 8, sm: 8, md: 8 }} container spacing={1}>
                     <Grid2 className='flex items-center' size={{ xs: 7, sm: 7, md: 7 }}>
                        <Box className='flex justify-start items-center'>
                           <div className='text-base font-medium text-gray-600'>Collection</div>
                        </Box>
                     </Grid2>

                     <Grid2 style={{ display: "flex", justifyContent: "flex-end" }} size={{ xs: 1, sm: 1, md: 1 }}>
                        <Box>
                           <Tooltip
                              onClick={(e) => {
                                 e.stopPropagation();
                                 handleCreateCollection(windowTabs.length);
                              }}
                              title={"New collection"}
                              TransitionComponent={Zoom}
                              TransitionProps={{ timeout: 200 }}
                              disableInteractive>
                              <div
                                 className=' transition duration-200 hover:shadow-custom-hover shadow-custom ease-in bg-white cursor-pointer rounded flex justify-center items-center'
                                 style={{
                                    width: "30px",
                                    height: "30px",
                                 }}>
                                 <HiOutlinePlus className='text-base' />
                              </div>
                           </Tooltip>
                        </Box>
                     </Grid2>
                  </Grid2>
               </div>

               <Masonry
                  breakpointCols={{
                     default: 3,
                  }}
                  className='flex -ml-2'
                  columnClassName='pl-2 space-y-2'>
                  {windowTabs.map((windowTab, index) => (
                     <Box sx={{ height: "auto" }}>
                        <WindowCollection
                           window={{
                              windowTab,
                              index,
                              typeDisplay: typeDisplay,
                              typeFeature: type,
                           }}
                        />
                     </Box>
                  ))}
               </Masonry>
            </motion.div>
         )}
      </div>
   );
}

export default MainCollections;

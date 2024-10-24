/** @format */

import React, { useState, useRef, useEffect, Suspense, lazy } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Grid2 } from "@mui/material";
import { Box } from "@mui/material";
import { setValueCollection, createCollection, addCollectionItem } from "../../../../store/features/windowSlices";
import Masonry from "react-masonry-css";
import { Tooltip, Zoom } from "@mui/material";
import { HiOutlinePlus } from "react-icons/hi2";
import servicePopup from "../../servicePopup";
import serviceChrome from "../../../services/ServiceChrome";
import { ActionTab } from "../../../../enums/action";
import { addNoti, updateAuth } from "../../../../store/features/popupSlices";
import { v4 as uuidv4 } from "uuid";
import { useDrag, useDrop } from "react-dnd";
const WindowCollection = lazy(() => import("../collection/WindowCollection"));
/* global chrome */

function MainCollections() {
   const dispatch = useDispatch();
   const dropRef = useRef(null);
   const windowTabs = useSelector((state) => state.window.collection);
   const [windowList, setWindowList] = useState([]);
   const type = process.env.REACT_APP_TYPE_COLLECTION;
   const typeDisplay = useSelector((state) => state.current.displayState);

   useEffect(() => {
      setWindowList(windowTabs);
   }, [windowTabs]);

   const handleCreateCollection = async (windowCollectionLength) => {
      const title = process.env.REACT_APP_TYPE_DEFAULT_NAME_COLLECTION + "_" + windowCollectionLength;
      const response = await servicePopup.createCollection(title);
      if (response === null) {
         dispatch(updateAuth(false));
         dispatch(addNoti({ message: "Session expire, please login again", id: uuidv4(), status: 401 }));
      } else {
         const { data, status, message } = response.data;
         serviceChrome.sendMessage({ collection: data }, ActionTab.typeCreateCollection);
         dispatch(createCollection({ collection: data }));
         dispatch(addNoti({ id: uuidv4(), status, message }));
      }
   };

   return (
      <div>
         <motion.div initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 0, opacity: 20 }} transition={{ duration: 0.3 }}>
            <div className='mb-2'>
               <Grid2 columns={{ xs: 8, sm: 8, md: 8 }} container spacing={1}>
                  <Grid2 className='flex items-center' size={{ xs: 7, sm: 7, md: 7 }}>
                     <Box className='flex justify-start items-center'>
                        <div className='text-base font-medium text-gray-600'>Collections</div>
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
                           TransitionProps={{ timeout: 250 }}
                           disableInteractive>
                           <div
                              className=' transition duration-200 hover:bg-custom-color-title hover:text-white shadow-custom ease-in bg-white cursor-pointer rounded flex justify-center items-center'
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
               {windowList.map((windowTab, index) => {
                  return (
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
                  );
               })}
            </Masonry>
         </motion.div>
      </div>
   );
}

export default MainCollections;

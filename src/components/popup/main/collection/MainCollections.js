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
import { PiNotePencilThin } from "react-icons/pi";
import servicePopup from "../../servicePopup";
import serviceChrome from "../../../services/ServiceChrome";
import { ActionTab } from "../../../../enums/action";
import { addNoti } from "../../../../store/features/popupSlices";
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
   const tabType = process.env.REACT_APP_TYPE_TAB;
   const collectionType = process.env.REACT_APP_TYPE_COLLECTION;
   const [stateCreateCollection, setStateCreateCollection] = useState(false);
   const [title, setTitle] = useState("");
   const [note, setNote] = useState("");

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

   const handleCreateCollection = async (title, note) => {
      const response = await servicePopup.createCollection(title, note);
      const { data, status, message } = response.data;
      serviceChrome.sendMessage({ collection: data }, ActionTab.typeCreateCollection);
      dispatch(createCollection({ collection: data }));
      dispatch(addNoti({ id: uuidv4(), status, message }));
      setStateCreateCollection(false);
   };

   return (
      <div>
         {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
               <CircularProgress aria-label='Loading....' aria-busy={loading ? "true" : "false"} aria-live='polite' />
            </div>
         ) : (
            <motion.div ref={combinedRef} initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 0, opacity: 20 }} transition={{ duration: 0.3 }}>
               <div>
                  <Grid2 columns={{ xs: 8, sm: 8, md: 8 }} container spacing={1}>
                     <Grid2 size={{ xs: 7, sm: 7, md: 7 }}>
                        <div className='text-base font-medium text-gray-600'>Collection</div>
                     </Grid2>

                     <Grid2 style={{ display: "flex", justifyContent: "flex-end" }} size={{ xs: 1, sm: 1, md: 1 }}>
                        <Box>
                           <Tooltip
                              onClick={(e) => {
                                 e.stopPropagation();
                                 setStateCreateCollection(true);
                              }}
                              title={"New collection"}
                              TransitionComponent={Zoom}
                              TransitionProps={{ timeout: 200 }}
                              disableInteractive>
                              <div
                                 className=' transition duration-200  ease-in bg-white hover:shadow-custom-hover cursor-pointer rounded shadow-custom flex justify-center items-center'
                                 style={{
                                    width: "50px",
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

                  <AnimatePresence>
                     {!stateCreateCollection ? null : (
                        <motion.div key={windowTabs.length} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }}>
                           <Box sx={{ height: "auto" }}>
                              <div className='transition duration-200 ease-in space-y-2 hover:-translate-y-1 bg-white p-4 hover:shadow-custom-hover cursor-pointer shadow-custom rounded-md z-10 will-change-transform will-change-shadow'>
                                 <div className='space-y-4'>
                                    <div>
                                       <div className='flex items-center space-x-1'>
                                          <span className='text-custom-color-title text-xs font-semibold'># </span>
                                          <span className='text-xs font-medium text-center'>Collection name :</span>
                                       </div>
                                       <input
                                          type='text'
                                          onChange={(e) => {
                                             setTitle(e.target.value);
                                          }}
                                          className='mt-1 block w-full p-2 border border-gray-200 rounded shadow-sm outline-none focus:ring-0'
                                          placeholder='Collection name'
                                       />
                                    </div>

                                    <div>
                                       <div className='flex items-center space-x-1'>
                                          <PiNotePencilThin className='text-base text-custom-color-title font-bold' /> <span className='text-xs font-medium text-center'>note</span>
                                       </div>
                                       <input
                                          type='text'
                                          onChange={(e) => {
                                             setNote(e.target.value);
                                          }}
                                          className='mt-1 block p-2 w-full border border-gray-200 shadow-sm rounded outline-none focus:ring-0'
                                          placeholder='Note'
                                       />
                                    </div>

                                    <div className='flex space-x-2 justify-end'>
                                       <button
                                          onClick={(e) => {
                                             handleCreateCollection(title, note);
                                          }}
                                          className='inline-flex justify-center p-2 bg-custom-color-title border border-transparent shadow-sm text-xs font-medium text-center rounded text-white focus:outline-none'>
                                          Create
                                       </button>

                                       <button
                                          className='inline-flex justify-center p-2 border border-gray-200 border-transparent shadow-sm text-xs font-medium text-center text-black rounded focus:outline-none'
                                          onClick={() => {
                                             setStateCreateCollection(false);
                                          }}>
                                          Close
                                       </button>
                                    </div>
                                 </div>
                              </div>
                           </Box>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </Masonry>
            </motion.div>
         )}
      </div>
   );
}

export default MainCollections;

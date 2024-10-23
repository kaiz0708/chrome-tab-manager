/** @format */
import { useDrag, useDrop } from "react-dnd";
import serviceChrome from "../../../services/ServiceChrome";
import React, { useEffect, useRef, lazy, Suspense } from "react";
import { Tooltip, Zoom } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { AnimatePresence } from "framer-motion";
import { ActionTab } from "../../../../enums/action";
import Masonry from "react-masonry-css";
import { Box } from "@mui/material";
import { HiOutlinePlus } from "react-icons/hi2";
import servicePopup from "../../servicePopup";
import { deleteCollectionItem } from "../../../../store/features/windowSlices";
import { Grid2 } from "@mui/material";

const MainCollections = lazy(() => import("../collection/MainCollections"));
/* global chrome */

const WindowTab = lazy(() => import("./WindowTab"));

function MainPopup({ windowTabs, typeDisplay }) {
   const dropRef = useRef(null);
   const type = process.env.REACT_APP_TYPE_TAB;
   const stateCollection = useSelector((state) => state.current.displayCollection);
   const dispatch = useDispatch();
   const tabType = process.env.REACT_APP_TYPE_TAB;
   const collectionType = process.env.REACT_APP_TYPE_COLLECTION;

   const [{ isOver }, drop] = useDrop({
      accept: "ITEM",
      drop: async (item, monitor) => {
         const { tab, index } = item;
         if (monitor.didDrop()) {
            return;
         }
         if (item.display === tabType) {
            serviceChrome.openWindowGroup([tab]);
         } else {
            const response = await servicePopup.deleteTabToCollection(item.tab, item.tab.collection);
            const { data } = response.data;
            const idCollection = item.tab.collection;
            serviceChrome.sendMessage({ idCollection: idCollection, tab: data }, ActionTab.typeDeleteCollection);
            dispatch(deleteCollectionItem({ idCollection: idCollection, tab: data }));
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
            <div className='mb-2'>
               <Grid2 columns={{ xs: 8, sm: 8, md: 8 }} container spacing={1}>
                  <Grid2 className='flex items-center' size={{ xs: 7, sm: 7, md: 7 }}>
                     <Box className='flex justify-start items-center'>
                        <div className='text-base font-medium text-gray-600'>Tabs</div>
                     </Box>
                  </Grid2>

                  <Grid2 style={{ display: "flex", justifyContent: "flex-end" }} size={{ xs: 1, sm: 1, md: 1 }}>
                     <Box>
                        <Tooltip
                           onClick={(e) => {
                              e.stopPropagation();
                              openNewWindowEmpty();
                           }}
                           title={"Open new window"}
                           TransitionComponent={Zoom}
                           TransitionProps={{ timeout: 200 }}
                           disableInteractive>
                           <div
                              className=' transition duration-200 ease-in bg-white hover:shadow-custom-hover cursor-pointer rounded shadow-custom flex justify-center items-center'
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
            </Masonry>
         </div>

         <div className={`relative bg-gray-100 border-1 p-2 text-black overflow-y-auto scrollbar-thumb-rounded ${stateCollection ? "h-[50%]" : "overflow hidden"}`}>
            {stateCollection ? (
               <Suspense>
                  <AnimatePresence>
                     <MainCollections />
                  </AnimatePresence>
               </Suspense>
            ) : null}
         </div>
      </div>
   );
}

export default MainPopup;

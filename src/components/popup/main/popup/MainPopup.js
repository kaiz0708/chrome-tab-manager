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
import { deleteCollectionItem, deleteCollection, createCollection, addCollectionItem } from "../../../../store/features/windowSlices";
import { updateAuth, addNoti } from "../../../../store/features/popupSlices";
import { Grid2 } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

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
   const windowList = useSelector((state) => state.window.collection);

   const [{ isOver }, drop] = useDrop({
      accept: ["ITEM", "SUB_ITEM"],
      drop: async (item, monitor) => {
         if (monitor.didDrop()) {
            return;
         }
         const { display } = item;
         if (display === tabType) {
            const { tab, index } = item;
            serviceChrome.openWindowGroup([tab]);
         } else {
            if (display === collectionType) {
               const { tab, index } = item;
               const response = await servicePopup.deleteTabToCollection(item.tab, item.tab.collection);
               if (response === null) {
                  dispatch(updateAuth(false));
                  dispatch(addNoti({ message: "session expire, please login again", id: uuidv4(), status: 401 }));
               } else {
                  const { data } = response.data;
                  const idCollection = item.tab.collection;
                  serviceChrome.sendMessage({ idCollection: idCollection, tab: data }, ActionTab.typeDeleteItemCollection);
                  dispatch(deleteCollectionItem({ idCollection: idCollection, tab: data }));
                  serviceChrome.openWindow([tab.url]);
               }
            } else {
               const { id, url } = item;
               const response = await servicePopup.deleteCollection(id);
               if (response === null) {
                  dispatch(updateAuth(false));
                  dispatch(addNoti({ message: "Session expire, please login again", id: uuidv4(), status: 401 }));
               } else {
                  const { data, status, message } = response.data;
                  serviceChrome.sendMessage({ collection: data }, ActionTab.typeDeleteCollection);
                  dispatch(deleteCollection({ collection: data }));
                  dispatch(addNoti({ id: uuidv4(), status, message }));
                  serviceChrome.openWindow(url);
               }
            }
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

   const [{ isOverCollection }, dropCollection] = useDrop({
      accept: ["SUB_ITEM", "ITEM_COLLECTION"],
      drop: async (item, monitor) => {
         if (monitor.didDrop()) {
            return;
         }
         const title = process.env.REACT_APP_TYPE_DEFAULT_NAME_COLLECTION + "_" + windowList.length;
         const responseCreateCollection = await servicePopup.createCollection(title);
         if (responseCreateCollection === null) {
            dispatch(updateAuth(false));
            dispatch(addNoti({ message: "Session expire, please login again", id: uuidv4(), status: 401 }));
         } else {
            const { data, status, message } = responseCreateCollection.data;
            serviceChrome.sendMessage({ collection: data }, ActionTab.typeCreateCollection);
            dispatch(createCollection({ collection: data }));
            const collectionId = data.id;
            if (item.type === "tab") {
               const responseAddItemCollection = await servicePopup.addTabToCollection(item.tab, collectionId, 0);
               if (responseAddItemCollection === null) {
                  dispatch(updateAuth(false));
                  dispatch(addNoti({ message: "Session expire, please login again", id: uuidv4(), status: 401 }));
               } else {
                  const { data, status, message } = responseAddItemCollection.data;
                  serviceChrome.sendMessage({ id: collectionId, tab: data, newPosition: 0 }, ActionTab.typeAddItemCollection);
                  dispatch(addCollectionItem({ id: collectionId, tab: data, newPosition: 0 }));
                  dispatch(addNoti({ message, id: uuidv4(), status }));
                  if (item.display === tabType) {
                     serviceChrome.closeTab(item.tab.id, item.tab.windowId);
                  } else {
                     const collectionId = item.tab.collection;
                     const response = await servicePopup.deleteTabToCollection(item.tab, collectionId);
                     if (response === null) {
                        dispatch(updateAuth(false));
                        dispatch(addNoti({ message: "Session expire, please login again", id: uuidv4(), status: 401 }));
                     } else {
                        const { data, status, message } = response.data;
                        serviceChrome.sendMessage({ idCollection: collectionId, tab: data }, ActionTab.typeDeleteItemCollection);
                        dispatch(deleteCollectionItem({ idCollection: collectionId, tab: data }));
                     }
                  }
               }
            } else {
               item.window.windowTab.tabs.forEach(async (tab, index) => {
                  const responseAddItemCollection = await servicePopup.addTabToCollection(tab, collectionId, index);
                  if (responseAddItemCollection === null) {
                     dispatch(updateAuth(false));
                     dispatch(addNoti({ message: "Session expire, please login again", id: uuidv4(), status: 401 }));
                  } else {
                     const { data, status, message } = responseAddItemCollection.data;
                     serviceChrome.sendMessage({ id: collectionId, tab: data, newPosition: index }, ActionTab.typeAddItemCollection);
                     dispatch(addCollectionItem({ id: collectionId, tab: data, newPosition: index }));
                     serviceChrome.closeTab(tab.id, tab.windowId);
                  }
               });
            }
         }
      },
      collect: (monitor) => ({
         isOverCollection: !!monitor.isOver(),
      }),
   });

   const combinedRefCollection = (el) => {
      dropRef.current = el;
      dropCollection(el);
   };

   const openNewWindowEmpty = () => {
      serviceChrome.openWindow(["chrome://newtab"]);
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
                           TransitionProps={{ timeout: 250 }}
                           disableInteractive>
                           <div
                              className=' transition duration-200 ease-in bg-white hover:bg-custom-color-title hover:text-white cursor-pointer rounded shadow-custom flex justify-center items-center'
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

         <div ref={combinedRefCollection} className={`relative bg-gray-100 border-1 p-2 text-black overflow-y-auto scrollbar-thumb-rounded ${stateCollection ? "h-[50%]" : "overflow hidden"}`}>
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

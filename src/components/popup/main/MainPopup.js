/** @format */
import { useDrag, useDrop } from "react-dnd";
import serviceChrome from "../../services/ServiceChrome";
import React, { useEffect, useRef, lazy, Suspense } from "react";
import { Grid2, Tooltip, Zoom } from "@mui/material";
import { ActionTab } from "../../../enums/ActionTab";
import { HiOutlinePlus } from "react-icons/hi2";
import Collection from "./Collections";

const WindowTab = lazy(() => import("./WindowTab"));

function MainPopup({ windowTabs, typeDisplay }) {
   const dropRef = useRef(null);
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
      <div
         ref={combinedRef}
         className='p-2 h-custom relative bg-gray-100 overflow-y-auto scrollbar-thumb-rounded'>
         <Grid2
            columns={
               typeDisplay === ActionTab.typeTabHori
                  ? { xs: 3, sm: 3, md: 3 }
                  : { xs: 2, sm: 2, md: 2 }
            }
            container
            spacing={1}>
            {windowTabs.map((windowTab, index) => (
               <Grid2 size={{ xs: 1, sm: 1, md: 1 }} key={index}>
                  <Suspense>
                     <WindowTab
                        window={{
                           windowTab,
                           index,
                           typeDisplay: typeDisplay,
                        }}
                     />
                  </Suspense>
               </Grid2>
            ))}

            <Grid2 size={{ xs: 1, sm: 1, md: 1 }}>
               <Tooltip
                  disableInteractive
                  title={"Open new windows"}
                  TransitionComponent={Zoom}
                  TransitionProps={{ timeout: 300 }}
                  onClick={() => {
                     serviceChrome.openWindow("chrome://newtab");
                  }}>
                  <div
                     className={`cursor-pointer h-customBlock border-1 flex justify-center items-center bg-white p-2 rounded-md hover:bg-gray-100 text-base transition duration-300 ease-in-out`}>
                     <HiOutlinePlus className='text-3xl' />
                  </div>
               </Tooltip>
            </Grid2>
         </Grid2>

         <Collection />
      </div>
   );
}

export default MainPopup;

/** @format */
import WindowTab from "./WindowTab";
import { useDrag, useDrop } from "react-dnd";
import serviceChrome from "../../services/ServiceChrome";
import React, { useEffect, useRef } from "react";
import { Grid2 } from "@mui/material";
import { ActionTab } from "../../../enums/ActionTab";

function MainPopup({ windowTabs, typeDisplay }) {
   const dropRef = useRef(null);
   const [{ isOver }, drop] = useDrop({
      accept: "ITEM",
      drop: (item, monitor) => {
         const { windowId, tabId, url } = item;
         serviceChrome.openWindow(url);
         serviceChrome.closeTab(tabId, windowId);
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
         className='p-2 h-custom bg-gray-100 overflow-y-auto scrollbar-thumb-rounded'>
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
                  <WindowTab
                     window={{
                        windowTab,
                        index,
                        typeDisplay: typeDisplay,
                     }}
                  />
               </Grid2>
            ))}
         </Grid2>
      </div>
   );
}

export default MainPopup;

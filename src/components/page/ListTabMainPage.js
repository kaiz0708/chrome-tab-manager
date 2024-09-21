/** @format */

import WindowTab from "../popup/main/WindowTab";
import { Grid2 } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

/* global chrome */

function ListTabMainPage({ window }) {
   return (
      <div className=''>
         <div className='text-custom-title font-medium h-10 p-2 leading-10'>
            OPEN TABS
         </div>

         <div className='scrollbar-thumb-rounded overflow-y-auto flex justify-center items-center'>
            <div className='w-[90%]'>
               <Grid2 columns={{ xs: 1, sm: 1, md: 1 }} container spacing={0.5}>
                  {window.windowTabs.map((windowTab, index) => (
                     <Grid2
                        size={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}
                        key={index}>
                        <WindowTab
                           window={{
                              windowTab,
                              index,
                              typeDisplay: window.typeDisplay,
                           }}
                        />
                     </Grid2>
                  ))}
               </Grid2>
            </div>
         </div>
      </div>
   );
}

export default ListTabMainPage;

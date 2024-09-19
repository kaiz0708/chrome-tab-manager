/** @format */

import WindowTab from "../popup/main/WindowTab";
import { useSelector, useDispatch } from "react-redux";
import { Grid2 } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

/* global chrome */

function ListTabMainPage({ window }) {
   return (
      <div className='scrollbar-thumb-rounded overflow-y-auto'>
         <div>OPEN TABS</div>
         <Grid2 columns={{ xs: 1, sm: 1, md: 1 }} container spacing={1}>
            {window.windowTabs.map((windowTab, index) => (
               <Grid2 size={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }} key={index}>
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
   );
}

export default ListTabMainPage;

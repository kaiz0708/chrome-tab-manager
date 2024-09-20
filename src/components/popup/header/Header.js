/** @format */
/* global chrome */
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Grid2 } from "@mui/material";

function Header() {
   const windowCurrent = useSelector((state) => state.current.value);
   const moveMainPageExtension = () => {
      chrome.tabs.create({
         windowId: windowCurrent,
         url: process.env.REACT_APP_TYPE_URL_MAIN_PAGE,
      });
   };

   return (
      <Grid2 columns={{ xs: 1, sm: 1, md: 1 }} container>
         <Grid2 size={{ xs: 1, sm: 1, md: 1 }}>
            <Grid2 columns={{ xs: 4, sm: 4, md: 4 }} container spacing={1}>
               <Grid2 size={{ xs: 3, sm: 3, md: 3 }}>
                  <div className='hover:cursor-pointer size-5'>Tab Manager</div>
               </Grid2>

               <Grid2
                  container
                  justifyContent={"flex-end"}
                  size={{ xs: 1, sm: 1, md: 1 }}
                  onClick={(e) => {
                     moveMainPageExtension();
                  }}>
                  <div className='hover:cursor-pointer size-5'>
                     Open Antinotion App
                  </div>
               </Grid2>
            </Grid2>
         </Grid2>

         <Grid2 size={{ xs: 1, sm: 1, md: 1 }}>
            <Grid2 columns={{ xs: 6, sm: 6, md: 6 }} container spacing={2}>
               <Grid2 size={{ xs: 1, sm: 1, md: 1 }}>Current Tabs</Grid2>

               <Grid2 size={{ xs: 1, sm: 1, md: 1 }}>Collection</Grid2>
            </Grid2>
         </Grid2>
      </Grid2>
   );
}

export default Header;

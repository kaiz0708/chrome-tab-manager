/** @format */
/* global chrome */
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Grid2 } from "@mui/material";
import { CiViewTable } from "react-icons/ci";
import { BsCollection } from "react-icons/bs";

function Header() {
   const windowCurrent = useSelector((state) => state.current.value);
   const moveMainPageExtension = () => {
      chrome.tabs.create({
         windowId: windowCurrent,
         url: process.env.REACT_APP_TYPE_URL_MAIN_PAGE,
      });
   };

   return (
      <div className='p-2'>
         <Grid2 size={{ xs: 1, sm: 1, md: 1 }}>
            <Grid2 columns={{ xs: 12, sm: 12, md: 12 }} container spacing={1}>
               <Grid2 size={{ xs: 8, sm: 8, md: 8 }}>
                  <div className='text-lg font-medium text-gray-600'>
                     Tab Manager
                  </div>
               </Grid2>

               <Grid2
                  container
                  justifyContent={"flex-end"}
                  size={{ xs: 4, sm: 4, md: 4 }}
                  onClick={(e) => {
                     moveMainPageExtension();
                  }}>
                  <div className='hover:cursor-pointer font-medium text-gray-400'>
                     Open Antinotion App
                  </div>
               </Grid2>
            </Grid2>
         </Grid2>
      </div>
   );
}

export default Header;

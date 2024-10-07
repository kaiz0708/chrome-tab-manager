/** @format */
/* global chrome */
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Grid2 } from "@mui/material";
import serviceChrome from "../../services/ServiceChrome";
import { updateAuth } from "../../../store/features/popupSlices";

function Header() {
   const windowCurrent = useSelector((state) => state.current.value);
   const dispatch = useDispatch();

   return (
      <div className='p-2'>
         <Grid2 columns={{ xs: 4, sm: 4, md: 4 }} spacing={1}>
            <Grid2 size={{ xs: 3, sm: 3, md: 3 }}>
               <div className='text-lg font-medium text-gray-600'>Tab Manager</div>
            </Grid2>

            <Grid2 size={{ xs: 1, sm: 1, md: 1 }}>
               <div
                  onClick={() => {
                     serviceChrome.removeValueLocal(["token"]);
                     dispatch(updateAuth(false));
                  }}
                  className='cursor-pointer'>
                  Log out
               </div>
            </Grid2>
         </Grid2>
      </div>
   );
}

export default Header;

/** @format */
/* global chrome */
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Grid2 } from "@mui/material";
import { CiViewTable } from "react-icons/ci";
import { BsCollection } from "react-icons/bs";

function Header() {
   const windowCurrent = useSelector((state) => state.current.value);

   return (
      <div className='p-2'>
         <div className='text-lg font-medium text-gray-600'>Tab Manager</div>
      </div>
   );
}

export default Header;

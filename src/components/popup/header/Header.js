/** @format */
/* global chrome */
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import serviceChrome from "../../services/ServiceChrome";
import { updateAuth } from "../../../store/features/popupSlices";
import { CiUser } from "react-icons/ci";
import { Menu, MenuItem, Box, Grid2 } from "@mui/material";

function Header() {
   const user = useSelector((state) => state.current.user);
   const dispatch = useDispatch();
   const [anchorEl, setAnchorEl] = useState(null);
   const open = Boolean(anchorEl);

   const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
   };

   const handleClose = () => {
      setAnchorEl(null);
   };

   const logout = () => {
      serviceChrome.removeValueLocal(["token"]);
      dispatch(updateAuth(false));
   };

   return (
      <div className='p-2'>
         <Grid2 columns={{ xs: 8, sm: 8, md: 8 }} container spacing={1}>
            <Grid2 size={{ xs: 6, sm: 6, md: 6 }}>
               <div className='text-lg font-medium text-gray-600'>Antinotion Tab Manager</div>
            </Grid2>

            <Grid2 size={{ xs: 2, sm: 2, md: 2 }}>
               <Box className='flex justify-end items-end space-x-2 '>
                  <Box className='w-full'>
                     <div className='text-xs overflow-hidden text-ellipsis whitespace-nowrap text-gray-400'>{user.username}</div>
                     <div className='text-xs overflow-hidden text-ellipsis whitespace-nowrap text-gray-400'>{user.email}</div>
                  </Box>
                  <Box onClick={handleClick} className='cursor-pointer border-1 border-dashed h-10 flex justify-center items-center p-2 rounded-xl hover:bg-gray-100 text-base transition duration-300 ease-in-out'>
                     <CiUser className='text-xl' />
                  </Box>
               </Box>

               <Menu
                  className=''
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  anchorOrigin={{
                     vertical: "bottom",
                     horizontal: "right",
                  }}
                  transformOrigin={{
                     vertical: "top",
                     horizontal: "right",
                  }}>
                  <MenuItem className='p-2 text-xs text-gray-400' onClick={logout}>
                     Log out
                  </MenuItem>
               </Menu>
            </Grid2>
         </Grid2>
      </div>
   );
}

export default Header;

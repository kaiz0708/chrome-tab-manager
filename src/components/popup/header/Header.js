/** @format */
/* global chrome */
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import serviceChrome from "../../services/ServiceChrome";
import { updateAuth, addNoti, updateStateCollection } from "../../../store/features/popupSlices";
import { CiUser } from "react-icons/ci";
import { Menu, MenuItem, Box, Grid2 } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

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
      dispatch(addNoti({ message: "Log out success", id: uuidv4(), status: 200 }));
      dispatch(updateStateCollection(false));
   };

   return (
      <div className='p-2'>
         <Grid2 columns={{ xs: 8, sm: 8, md: 8 }} container spacing={1}>
            <Grid2 size={{ xs: 6, sm: 6, md: 6 }}>
               <div className='text-lg font-medium leading-10 text-gray-600'>Antinotion Tab Manager</div>
            </Grid2>

            <Grid2 size={{ xs: 2, sm: 2, md: 2 }}>
               <Box className='flex justify-end items-center space-x-2 '>
                  <Box className='w-customTruncate'>
                     <div className='text-xs overflow-hidden text-ellipsis whitespace-nowrap text-gray-400'>{user.username}</div>
                     <div className='text-xs overflow-hidden text-ellipsis whitespace-nowrap text-gray-400'>{user.email}</div>
                  </Box>
                  <Box onClick={handleClick} className='cursor-pointer border-1 border-dashed h-10 flex justify-center items-center p-2 rounded-xl hover:bg-gray-100 text-base transition duration-300 ease-in-out'>
                     <CiUser className='text-xl' />
                  </Box>
               </Box>

               <Menu
                  sx={{
                     "& .MuiMenu-paper": {
                        width: "120px",
                     },
                     "& .css-1c1ttle": {
                        padding: "4px !important",
                     },
                  }}
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
                  <MenuItem
                     sx={{
                        fontSize: "12px",
                        color: "gray",
                        lineHeight: "1.2",
                        justifyContent: "center",
                        textAlign: "center",
                        backgroundColor: "white !important",
                        cursor: "pointer",
                        "&:hover": {
                           backgroundColor: "#f5f5f5 !important",
                        },
                     }}
                     onClick={logout}>
                     Log out
                  </MenuItem>
               </Menu>
            </Grid2>
         </Grid2>
      </div>
   );
}

export default Header;

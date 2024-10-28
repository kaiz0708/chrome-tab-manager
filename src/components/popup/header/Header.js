/** @format */
/* global chrome */
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import serviceChrome from "../../services/ServiceChrome";
import { updateAuth, addNoti, updateStateCollection } from "../../../store/features/popupSlices";
import { CiUser } from "react-icons/ci";
import antinotionLogo from "../../../img/2.png";
import { Menu, MenuItem, Box, Grid2, Tooltip, Zoom } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { ActionTab } from "../../../enums/action";

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
      serviceChrome.sendMessage({ data: "success" }, ActionTab.typeLogout);
      dispatch(addNoti({ message: "Log out success", id: uuidv4(), status: 200 }));
      dispatch(updateStateCollection(false));
   };

   return (
      <div className='p-1'>
         <Grid2 columns={{ xs: 10, sm: 10, md: 10 }} container spacing={1}>
            <Grid2 size={{ xs: 9, sm: 9, md: 9 }}>
               <div className='flex justify-start items-center space-x-2'>
                  <img src={antinotionLogo} className='w-[40px] h-[40px] object-cover rounded-full' />
                  <div className='text-xs font-normal leading-10 text-custom-color-title'>@antinotion</div>
               </div>
            </Grid2>

            <Grid2 size={{ xs: 1, sm: 1, md: 1 }}>
               <Tooltip TransitionComponent={Zoom} TransitionProps={{ timeout: 250 }} disableInteractive title={user.username}>
                  <Box className='flex justify-end items-center'>
                     <Box onClick={handleClick} className='cursor-pointer border-1 border-dashed h-10 w-10 flex justify-center items-center p-2 rounded-full hover:bg-gray-100 text-base transition duration-300 ease-in-out'>
                        <CiUser className='text-base' />
                     </Box>
                  </Box>
               </Tooltip>

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

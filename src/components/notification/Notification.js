/** @format */
import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useDispatch } from "react-redux";
import { removeNoti } from "../../store/features/popupSlices";

function Notification({ open, message, id }) {
   const dispatch = useDispatch();
   const handleCloseNoti = (id) => {
      dispatch(removeNoti(id));
   };
   return (
      <div>
         <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseNoti(id)} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
            <MuiAlert severity='success'>{message}</MuiAlert>
         </Snackbar>
      </div>
   );
}

export default Notification;

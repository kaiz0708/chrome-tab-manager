/** @format */
import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

function Notification({ open, message }) {
   return (
      <div>
         <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
            <MuiAlert
               severity='success'
               className='custom-alert' // Thêm className cho Alert
            >
               {message}
            </MuiAlert>
         </Snackbar>
      </div>
   );
}

export default Notification;

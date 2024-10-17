/** @format */
import { useSelector, useDispatch } from "react-redux";
import { React, lazy, Suspense, useState } from "react";
import { useEffect } from "react";
import { axios } from "./common/axios";
import { removeNoti, updateAuth, updateDisplay, updateOtp, updateUsename } from "./store/features/popupSlices";
import { CircularProgress } from "@mui/material";
import utils from "./common/utils";
import { useSnackbar } from "notistack";
import serviceChrome from "./components/services/ServiceChrome";
const Popup = lazy(() => import("./components/popup/Popup"));
const Login = lazy(() => import("./components/auth/Login"));
const Register = lazy(() => import("./components/auth/Register"));
const ForgotPassword = lazy(() => import("./components/auth/ForgotPassword"));
/* global chrome */
function App() {
   const isAuth = useSelector((state) => state.current.auth);
   const isRegister = useSelector((state) => state.current.register);
   const isDisplay = useSelector((state) => state.current.display);
   const notifications = useSelector((state) => state.current.notification);
   const isforgotPassword = useSelector((state) => state.current.forgotPassword);
   const isOtp = useSelector((state) => state.current.otp);
   const dispatch = useDispatch();
   const { enqueueSnackbar } = useSnackbar();

   useEffect(() => {
      const checkLoginStatus = async () => {
         const token = await utils.getToken();
         const otp = await utils.getStateOtp();
         const user = await utils.getUsername();

         dispatch(updateOtp(otp));
         dispatch(updateUsename(user));

         if (token) {
            console.log(token);
            try {
               const response = await axios.get("/auth/expire", {
                  headers: {
                     Authorization: "Bearer " + token,
                  },
               });
               if (response.data.status === 200 && response.data.message === "OK") {
                  dispatch(updateAuth(true));
               } else if (response.data.status === 401 && response.data.message === "Unauthorized") {
                  dispatch(updateAuth(false));
               }
            } catch (err) {
               dispatch(updateAuth(false));
            }
         } else {
            dispatch(updateAuth(false));
         }
      };

      checkLoginStatus().then(() => {
         dispatch(updateDisplay(true));
      });
   }, []);

   useEffect(() => {
      notifications.forEach((noti) => {
         enqueueSnackbar(noti.message, {
            variant: noti.status == 200 ? "success" : "error",
            autoHideDuration: 1500,
         });
         dispatch(removeNoti(noti.id));
      });
   }, [notifications, dispatch]);

   return (
      <div className='relative'>
         {!isDisplay ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
               <CircularProgress aria-label='Checking login status...' aria-live='polite' />
            </div>
         ) : isAuth ? (
            <Suspense>
               <Popup />
            </Suspense>
         ) : (
            <div className='bg-gray-50 flex items-center justify-center h-screen'>
               {isforgotPassword || isOtp ? (
                  <Suspense>
                     <ForgotPassword isOtp={isOtp} />
                  </Suspense>
               ) : isRegister ? (
                  <Suspense>
                     <Register />
                  </Suspense>
               ) : (
                  <Suspense>
                     <Login />
                  </Suspense>
               )}
            </div>
         )}
      </div>
   );
}

export default App;

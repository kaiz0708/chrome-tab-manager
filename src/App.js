/** @format */
import { useSelector, useDispatch } from "react-redux";
import { React, lazy, Suspense, useState } from "react";
import { useEffect } from "react";
import { axios } from "./common/axios";
import { removeNoti, updateAuth, updateDisplay, updateOtp, updateUsename, updateStateDisplay, updateStateCollection } from "./store/features/popupSlices";
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
   const loginGoogle = useSelector((state) => state.current.loginGoogle);
   const isOtp = useSelector((state) => state.current.otp);
   const dispatch = useDispatch();
   const { enqueueSnackbar } = useSnackbar();

   useEffect(() => {
      const checkLoginStatus = async () => {
         const token = await utils.getToken();
         const otp = await utils.getStateOtp();
         const user = await utils.getUsername();

         const stateDisplayCollection = await utils.getDisplayStateCollection();
         if (stateDisplayCollection === undefined) {
            serviceChrome.setStateLocal(process.env.REACT_APP_TYPE_NAME_STATE_COLLECTION, false);
            dispatch(updateStateCollection(false));
         } else {
            dispatch(updateStateCollection(stateDisplayCollection));
         }

         const state = await utils.getDisplayState();
         if (state === undefined) {
            serviceChrome.setStateLocal(process.env.REACT_APP_TYPE_NAME_VIEW_VARIABLE, process.env.REACT_APP_TYPE_TAB_HORIZONTAL);
            dispatch(updateStateDisplay(process.env.REACT_APP_TYPE_TAB_HORIZONTAL));
         } else {
            dispatch(updateStateDisplay(state));
         }

         dispatch(updateOtp(otp));
         dispatch(updateUsename(user));

         if (token) {
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
            autoHideDuration: 2000,
         });
         dispatch(removeNoti(noti.id));
      });
   }, [notifications, dispatch]);

   function LoadingOverlay() {
      return (
         <div
            style={{
               position: "fixed",
               top: 0,
               left: 0,
               width: "100vw",
               height: "100vh",
               backgroundColor: "rgba(0, 0, 0, 0.2)",
               display: "flex",
               justifyContent: "center",
               alignItems: "center",
               zIndex: 9999,
            }}>
            <CircularProgress aria-label='Checking login status...' aria-live='polite' style={{ color: "#fff" }} />
         </div>
      );
   }

   return (
      <div className='relative'>
         {loginGoogle ? <LoadingOverlay /> : null}
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

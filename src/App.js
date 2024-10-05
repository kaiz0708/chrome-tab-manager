/** @format */
import { useSelector, useDispatch } from "react-redux";
import { React, lazy, Suspense, useState } from "react";
import { useEffect } from "react";
import { axios } from "./common/axios";
import { updateAuth, updateDisplay } from "./store/features/popupSlices";
import { CircularProgress } from "@mui/material";
import serviceChrome from "./components/services/ServiceChrome";
const Popup = lazy(() => import("./components/popup/Popup"));
const Login = lazy(() => import("./components/auth/Login"));
const Register = lazy(() => import("./components/auth/Register"));
/* global chrome */
function App() {
   const isAuth = useSelector((state) => state.current.auth);
   const isRegister = useSelector((state) => state.current.register);
   const isDisplay = useSelector((state) => state.current.display);
   const dispatch = useDispatch();

   useEffect(() => {
      const checkLoginStatus = async () => {
         const token = await serviceChrome.getValueLocal("token");

         if (token) {
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
         } else {
            dispatch(updateAuth(false));
         }
      };

      checkLoginStatus().then(() => {
         dispatch(updateDisplay(true));
      });
   }, [dispatch]);
   return (
      <div>
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
               {isRegister ? (
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

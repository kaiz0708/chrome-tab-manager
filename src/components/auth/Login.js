/** @format */

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateAuth, updateRegister } from "../../store/features/popupSlices";
import serviceAuth from "./serviceAuth";
import serviceChrome from "../services/ServiceChrome";
import { v4 as uuidv4 } from "uuid";
import { addNoti } from "../../store/features/popupSlices";
import { FcGoogle } from "react-icons/fc";
import { AnimatePresence, motion } from "framer-motion";
/* global chrome */

const Login = () => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const dispatch = useDispatch();

   const handleSubmit = async (email, password) => {
      const response = await serviceAuth.login(email, password);
      const { status, message } = response.data;
      const { data } = response.data;
      const { token, user } = data;
      if (status === 200) {
         serviceChrome.setStateLocal("token", token);
         dispatch(updateAuth(true));
      } else {
         dispatch(updateAuth(false));
      }
      dispatch(addNoti({ message, id: uuidv4(), status }));
   };

   const googleLogin = async () => {
      chrome.identity.launchWebAuthFlow(
         {
            url: `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.REACT_APP_TYPE_CLIENT_ID_GOOGLE}&response_type=token&redirect_uri=https://${chrome.runtime.id}.chromiumapp.org&scope=https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email&prompt=consent`,
            interactive: true,
         },
         (redirect_url) => {
            const urlParams = new URLSearchParams(new URL(redirect_url).hash.substring(1));
            const token = urlParams.get("access_token");

            fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`)
               .then((response) => response.json())
               .then(async (userInfo) => {
                  const response = await serviceAuth.loginGoogle(userInfo);
                  const { data, status, message } = response.data;
                  const { token, user } = data;
                  if (status === 200) {
                     serviceChrome.setStateLocal("token", token);
                     dispatch(updateAuth(true));
                  } else {
                     dispatch(updateAuth(false));
                  }
                  dispatch(addNoti({ message, id: uuidv4(), status }));
               })
               .catch((error) => console.error("Error fetching user info:", error));
         }
      );
   };

   return (
      <AnimatePresence>
         <motion.div className='bg-white p-4 rounded-lg shadow-lg w-80' initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.5 }}>
            <h2 className='text-2xl font-bold text-center mb-6 text-gray-800'>Login</h2>
            <div className='mb-3'>
               <label className='block text-gray-600 mb-1'>Email</label>
               <input
                  type='email'
                  name='email'
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder='Enter your email'
               />
            </div>
            <div className='mb-3'>
               <label className='block text-gray-600 mb-1'>Password</label>
               <input
                  type='password'
                  name='password'
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder='Enter your password'
               />
            </div>
            <button
               onClick={() => {
                  handleSubmit(email, password);
               }}
               className='w-full mt-4 bg-custom-color-title text-white py-2 rounded-md  transition duration-300'>
               Login
            </button>

            <div className='mt-4 text-end'>
               <span className='text-custom-color-title hover:underline cursor-pointer'>Forgot Password?</span>
            </div>

            <div className='flex items-center my-4'>
               <div className='flex-grow border-t border-gray-300'></div>
               <span className='mx-2 text-gray-600'>or</span>
               <div className='flex-grow border-t border-gray-300'></div>
            </div>

            <div className='mt-4 flex items-center justify-center'>
               <button onClick={() => googleLogin()} className='flex items-center justify-center text-gray-800 py-2 px-4 rounded-md transition duration-300 hover:bg-gray-200'>
                  <FcGoogle className='mr-2' />
                  Sign in with Google
               </button>
            </div>

            <div className='mt-4 text-center'>
               <span>
                  <span className=' text-gray-400'>Are you new?</span>
                  <span
                     onClick={() => {
                        dispatch(updateRegister(true));
                     }}
                     className='text-custom-color-title hover:underline cursor-pointer'>
                     Have you a account?
                  </span>
               </span>
            </div>
         </motion.div>
      </AnimatePresence>
   );
};

export default Login;

/** @format */

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateAuth, updateRegister } from "../../store/features/popupSlices";
import serviceAuth from "./serviceAuth";
import serviceChrome from "../services/ServiceChrome";
import { v4 as uuidv4 } from "uuid";
import { addNoti } from "../../store/features/popupSlices";
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

   return (
      <div className='bg-white p-4 rounded-lg shadow-lg w-80'>
         <h2 className='text-2xl font-bold text-center mb-6 text-gray-800'>Login</h2>
         <div className='mb-3'>
            <label className='block text-gray-600 mb-1'>Email</label>
            <input type='email' name='email' className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500' value={email} onChange={(e) => setEmail(e.target.value)} required placeholder='Enter your email' />
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
            className='w-full bg-custom-color-title text-white py-2 rounded-md  transition duration-300'>
            Login
         </button>

         <div className='mt-4 text-center'>
            <span
               onClick={() => {
                  dispatch(updateRegister(true));
               }}
               className='text-custom-color-title text-sm hover:underline cursor-pointer'>
               Have you a account?
            </span>
         </div>

         <div className='mt-4 text-center'>
            <span className='text-custom-color-title text-sm hover:underline cursor-pointer'>Forgot Password?</span>
         </div>
      </div>
   );
};

export default Login;

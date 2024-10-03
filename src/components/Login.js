/** @format */

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateLogin } from "../store/features/popupSlices";

const Login = () => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const dispatch = useDispatch();

   const handleSubmit = () => {
      console.log("login.......");
      dispatch(updateLogin(true));
   };

   return (
      <div className='bg-gray-100 p-4 rounded-lg shadow-lg w-80'>
         <h2 className='text-2xl font-bold text-center mb-6 text-gray-800'>Login</h2>
         <div className='mb-4'>
            <label className='block text-gray-600 mb-2'>Email</label>
            <input type='email' name='email' className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500' value={email} onChange={(e) => setEmail(e.target.value)} required placeholder='Enter your email' />
         </div>
         <div className='mb-6'>
            <label className='block text-gray-600 mb-2'>Password</label>
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
               handleSubmit();
            }}
            className='w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300'>
            Login
         </button>
         <div className='mt-4 text-center'>
            <a href='#' className='text-blue-500 text-sm hover:underline'>
               Forgot Password?
            </a>
         </div>
      </div>
   );
};

export default Login;

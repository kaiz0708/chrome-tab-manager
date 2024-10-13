/** @format */
import React from "react";
import { useState } from "react";
import serviceAuth from "./serviceAuth";
import { updateAuth, updateRegister } from "../../store/features/popupSlices";
import serviceChrome from "../services/ServiceChrome";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { addNoti } from "../../store/features/popupSlices";
import { AnimatePresence, motion } from "framer-motion";

function Register() {
   const [confirmPassword, setConfirmPassword] = useState("");
   const [formData, setFormData] = useState({
      username: "",
      email: "",
      password: "",
   });
   const dispatch = useDispatch();

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
         ...prev,
         [name]: value,
      }));
   };

   const handleSubmit = async (formData) => {
      if (confirmPassword === formData.password) {
         const response = await serviceAuth.register(formData);
         const { status, message } = response.data;
         const { data } = response.data;
         const { token, user } = data;
         if (status === 200) {
            serviceChrome.setStateLocal("token", token);
            dispatch(updateAuth(true));
            dispatch(updateRegister(false));
         } else {
            dispatch(updateAuth(false));
         }
         dispatch(addNoti({ message, id: uuidv4(), status }));
      } else {
         dispatch(addNoti({ message: "Wrong confirm password", id: uuidv4(), status: 400 }));
      }
   };
   return (
      <AnimatePresence>
         <motion.div className='bg-white p-4 rounded-lg shadow-lg w-80' initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.5 }}>
            <h2 className='text-2xl font-bold text-center mb-6 text-gray-800'>Register</h2>

            <div className='mb-2'>
               <label className='block text-gray-600 mb-2'>Username</label>
               <input type='text' name='username' className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500' value={formData.username} onChange={handleChange} placeholder='Enter your username' />
            </div>

            <div className='mb-2'>
               <label className='block text-gray-600 mb-2'>Email</label>
               <input type='email' name='email' className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500' value={formData.email} onChange={handleChange} placeholder='Enter your email' />
            </div>

            <div className='mb-2'>
               <label className='block text-gray-600 mb-2'>Password</label>
               <input
                  type='password'
                  name='password'
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder='Enter your password'
               />
            </div>

            <div className='mb-2'>
               <label className='block text-gray-600 mb-2'>Confirm Password</label>
               <input
                  type='password'
                  name='confirm password'
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
                  value={confirmPassword}
                  onChange={(e) => {
                     setConfirmPassword(e.target.value);
                  }}
                  required
                  placeholder='Confirm your password'
               />
            </div>

            <button
               onClick={() => {
                  handleSubmit(formData);
               }}
               className='w-full mt-2 bg-custom-color-title text-white py-2 rounded-md  transition duration-300'>
               Register
            </button>

            <div className='mt-4 text-center'>
               <span>
                  <span className=' text-gray-400'>Already have an account?</span>
                  <span
                     onClick={() => {
                        dispatch(updateRegister(false));
                     }}
                     className='text-custom-color-title hover:underline cursor-pointer'>
                     Login
                  </span>
               </span>
            </div>
         </motion.div>
      </AnimatePresence>
   );
}

export default Register;

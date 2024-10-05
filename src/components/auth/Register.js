/** @format */
import React from "react";
import { useState } from "react";
import serviceAuth from "./serviceAuth";
import { updateAuth, updateRegister } from "../../store/features/popupSlices";
import serviceChrome from "../services/ServiceChrome";
import { useSelector, useDispatch } from "react-redux";

function Register() {
   const [confirmPassword, setConfirmPassword] = useState("");
   const [formData, setFormData] = useState({
      username: "",
      email: "",
      password: "",
      phoneNumber: "",
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
         if (status === 200 && message === "OK") {
            serviceChrome.setStateLocal("token", token);
            dispatch(updateAuth(true));
            dispatch(updateRegister(false));
         } else {
            if (status === 400 && message === "user already exist") {
               dispatch(updateAuth(false));
            }
         }
      } else {
         console.log(false);
      }
   };
   return (
      <div className='bg-white p-4 rounded-lg shadow-lg w-80'>
         <h2 className='text-2xl font-bold text-center mb-6 text-gray-800'>Register</h2>

         {/* Username */}
         <div className='mb-2'>
            <label className='block text-gray-600 mb-2'>Username</label>
            <input type='text' name='username' className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500' value={formData.username} onChange={handleChange} placeholder='Enter your username' />
         </div>

         {/* Email */}
         <div className='mb-2'>
            <label className='block text-gray-600 mb-2'>Email</label>
            <input type='email' name='email' className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500' value={formData.email} onChange={handleChange} placeholder='Enter your email' />
         </div>

         {/* Phone Number */}
         <div className='mb-2'>
            <label className='block text-gray-600 mb-2'>Phone Number (Optional)</label>
            <input type='tel' name='phoneNumber' className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500' value={formData.phoneNumber} onChange={handleChange} placeholder='Enter your phone number' />
         </div>

         {/* Password */}
         <div className='mb-2'>
            <label className='block text-gray-600 mb-2'>Password</label>
            <input type='password' name='password' className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500' value={formData.password} onChange={handleChange} required placeholder='Enter your password' />
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

         {/* Register Button */}
         <button
            onClick={() => {
               handleSubmit(formData);
            }}
            className='w-full bg-custom-color-title text-white py-2 rounded-md  transition duration-300'>
            Register
         </button>

         <div className='mt-4 text-center'>
            <span href='/login' className='text-custom-color-title text-sm hover:underline ursor-pointer'>
               Already have an account? Login
            </span>
         </div>
      </div>
   );
}

export default Register;

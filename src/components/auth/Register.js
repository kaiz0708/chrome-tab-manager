/** @format */
import React from "react";
import { useState } from "react";
import serviceAuth from "./serviceAuth";
import { updateAuth, updateRegister, updateUsename } from "../../store/features/popupSlices";
import serviceChrome from "../services/ServiceChrome";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { addNoti } from "../../store/features/popupSlices";
import { AnimatePresence, motion } from "framer-motion";
import { VscEyeClosed } from "react-icons/vsc";
import { VscEye } from "react-icons/vsc";

function Register() {
   const [confirmPassword, setConfirmPassword] = useState("");
   const [display, setDisplay] = useState({
      password: false,
      confirmPassword: false,
   });
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

   const checkValueLength = (formData) => {
      return Object.values(formData).every((value) => value.length >= 8);
   };

   const isNoWhitespaceAtEdges = (str) => {
      return !/\s/.test(str);
   };

   const checkValueSpace = (formData) => {
      return Object.values(formData).every((value) => isNoWhitespaceAtEdges(value));
   };

   const handleSubmit = async (formData) => {
      if (confirmPassword === formData.password) {
         const response = await serviceAuth.register(formData);
         if (response === null) {
            dispatch(addNoti({ message: "User already exist", id: uuidv4(), status: 401 }));
         } else {
            const { status, message } = response.data;
            const { data } = response.data;
            const { token, user } = data;
            if (status === 200) {
               serviceChrome.setStateLocal("token", token);
               serviceChrome.setStateLocal("user", user);
               dispatch(updateAuth(true));
               dispatch(updateRegister(false));
               dispatch(updateUsename(user));
            } else {
               dispatch(updateAuth(false));
            }
            dispatch(addNoti({ message, id: uuidv4(), status }));
         }
      } else {
         dispatch(addNoti({ message: "Confirmation password is incorrect", id: uuidv4(), status: 400 }));
      }
   };
   return (
      <AnimatePresence>
         <motion.div className='bg-white p-4 rounded-lg shadow-lg w-80' initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.5 }}>
            <h2 className='text-2xl font-bold text-center mb-6 text-gray-800'>Register</h2>

            <form
               onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(formData);
               }}>
               <div className='mb-2'>
                  <label className='block text-gray-600 mb-2'>Username</label>
                  <input
                     type='text'
                     name='username'
                     className={`w-full p-2.5 border border-gray-300 rounded-md focus:outline-none ${formData.username.length < 8 || isNoWhitespaceAtEdges(formData.username) === false ? "focus:border-red-500" : "focus:border-green-500"}`}
                     value={formData.username}
                     onChange={handleChange}
                     placeholder='Enter your username'
                  />
                  {(formData.username !== "" && formData.username.length < 8) || isNoWhitespaceAtEdges(formData.username) === false ? (
                     <motion.div className='text-xs mt-1.5 text-gray-400' initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                        Enter at least 8 characters without any spaces
                     </motion.div>
                  ) : null}
               </div>

               <div className='mb-2'>
                  <label className='block text-gray-600 mb-2'>Email</label>
                  <input
                     type='email'
                     name='email'
                     className={`w-full p-2.5 border border-gray-300 rounded-md focus:outline-none ${formData.email.length < 8 || isNoWhitespaceAtEdges(formData.email) === false ? "focus:border-red-500" : "focus:border-green-500"}`}
                     value={formData.email}
                     onChange={handleChange}
                     placeholder='Enter your email'
                  />
                  {(formData.email !== "" && formData.email.length < 8) || isNoWhitespaceAtEdges(formData.email) === false ? (
                     <motion.div className='text-xs mt-1.5 text-gray-400' initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                        Enter at least 8 characters without any spaces
                     </motion.div>
                  ) : null}
               </div>

               <div className='mb-2'>
                  <label className='block text-gray-600 mb-2'>Password</label>
                  <div className='relative'>
                     <input
                        type={display.password ? "text" : "password"}
                        name='password'
                        className={`w-full p-2.5 border border-gray-300 rounded-md focus:outline-none ${formData.password.length < 8 || isNoWhitespaceAtEdges(formData.password) === false ? "focus:border-red-500" : "focus:border-green-500"}`}
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder='Enter your password'
                     />
                     <div
                        className='absolute top-3 right-3 cursor-pointer'
                        onClick={(e) => {
                           setDisplay({
                              ...display,
                              password: !display.password,
                           });
                        }}>
                        {display.password ? <VscEye className='text-base' /> : <VscEyeClosed className='text-base' />}
                     </div>
                     {(formData.password !== "" && formData.password.length < 8) || isNoWhitespaceAtEdges(formData.password) === false ? (
                        <motion.div className='text-xs mt-1.5 text-gray-400' initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                           Enter at least 8 characters without any spaces
                        </motion.div>
                     ) : null}
                  </div>
               </div>

               <div className='mb-2'>
                  <label className='block text-gray-600 mb-2'>Confirm Password</label>
                  <div className='relative'>
                     <input
                        type={display.confirmPassword ? "text" : "password"}
                        name='confirm password'
                        className={`w-full p-2.5 border border-gray-300 rounded-md focus:outline-none ${confirmPassword.length < 8 || isNoWhitespaceAtEdges(confirmPassword) === false ? "focus:border-red-500" : "focus:border-green-500"}`}
                        value={confirmPassword}
                        onChange={(e) => {
                           setConfirmPassword(e.target.value);
                        }}
                        required
                        placeholder='Confirm your password'
                     />
                     <div
                        className='absolute top-3 right-3 cursor-pointer'
                        onClick={(e) => {
                           setDisplay({
                              ...display,
                              confirmPassword: !display.confirmPassword,
                           });
                        }}>
                        {display.confirmPassword ? <VscEye className='text-base' /> : <VscEyeClosed className='text-base' />}
                     </div>
                     {(confirmPassword !== "" && confirmPassword.length < 8) || isNoWhitespaceAtEdges(confirmPassword) === false ? (
                        <motion.div className='text-xs mt-1.5 text-gray-400' initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                           Enter at least 8 characters without any spaces
                        </motion.div>
                     ) : null}
                  </div>
               </div>
               <button
                  disabled={!checkValueLength(formData) || !checkValueSpace(formData) || !isNoWhitespaceAtEdges(confirmPassword) || confirmPassword === "" || confirmPassword.length < 8}
                  className={`w-full mt-2 bg-custom-color-title ${
                     checkValueLength(formData) && checkValueSpace(formData) === true && isNoWhitespaceAtEdges(confirmPassword) && confirmPassword.length >= 8 ? "bg-custom-color-title" : "opacity-50 cursor-not-allowed"
                  } text-white py-2 rounded-md  transition duration-300`}>
                  Register
               </button>
            </form>

            <div className='mt-4 text-center'>
               <span>
                  <span className=' text-gray-400'>Already have an account? </span>
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

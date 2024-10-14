/** @format */
import { AnimatePresence, motion } from "framer-motion";
import { updateAuth } from "../../store/features/popupSlices";
import { useState } from "react";
import serviceAuth from "./serviceAuth";
import { addNoti } from "../../store/features/popupSlices";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import OtpInput from "react-otp-input";

const ForgotPassword = () => {
   const [email, setEmail] = useState("");
   const [isForgotPassword, setForgotPassword] = useState(true);
   const [isVerifyOtp, setIsVerifyOtp] = useState(false);
   const [isChangePassWord, setIsChangePassword] = useState(false);
   const [otp, setOtp] = useState("");
   const dispatch = useDispatch();
   const handleSubmitResetPassword = async (email) => {
      const response = await serviceAuth.forgotPassword(email);
      const { status, message } = response.data;
      if (status == 200) {
         setForgotPassword(false);
         setIsVerifyOtp(true);
      }
      dispatch(addNoti({ message, id: uuidv4(), status }));
   };
   const handleVerifyOtp = async (email, code) => {
      const response = await serviceAuth.verifyOtp(code, email);
      const { status, message } = response.data;
      if (status == 200) {
         setForgotPassword(false);
         setIsVerifyOtp(false);
         setIsChangePassword(true);
      }
      dispatch(addNoti({ message, id: uuidv4(), status }));
   };
   return (
      <div>
         {isForgotPassword ? (
            <AnimatePresence>
               <motion.div className='bg-white p-4 rounded-lg shadow-lg w-80' initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.5 }}>
                  <h2 className='text-2xl font-bold text-center mb-6 text-gray-800'>Forgot password?</h2>
                  <p className='text-gray-400 mb-6 text-center'>No worries, we'll send you reset instructions.</p>

                  <input onChange={(e) => setEmail(e.target.value)} type='email' placeholder='Enter your email' className='w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none' required />
                  <button
                     onClick={() => {
                        handleSubmitResetPassword(email);
                     }}
                     type='submit'
                     className='w-full bg-custom-color-title text-white p-3 rounded-lg font-semibold transition duration-300'>
                     Reset password
                  </button>

                  <div className='mt-4 text-center'>
                     <span
                        onClick={() => {
                           updateAuth(false);
                        }}
                        className='block text-custom-color-title hover:underline cursor-pointer'>
                        Back to log in
                     </span>
                  </div>
               </motion.div>
            </AnimatePresence>
         ) : null}

         {isVerifyOtp ? (
            <AnimatePresence>
               <motion.div className='bg-white p-4 rounded-lg shadow-lg w-90' initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ duration: 0.5 }}>
                  <h2 className='text-2xl font-bold text-center mb-6 text-gray-800'>Verify OTP code</h2>
                  <OtpInput
                     value={otp}
                     onChange={setOtp}
                     numInputs={6}
                     renderSeparator={<span className='mx-2 text-gray-400'>-</span>}
                     renderInput={(props) => (
                        <input
                           {...props}
                           className='w-10 h-10 items-center p-1 border-1 border-gray-300 rounded-sm text-center focus:border-custom-color-title focus:outline-none transition'
                           style={{
                              fontSize: "0.5rem",
                           }}
                        />
                     )}
                  />
                  <button
                     onClick={() => {
                        handleVerifyOtp(email, otp);
                     }}
                     className='mt-4 px-4 py-2 bg-custom-color-title text-white rounded-lg transition'>
                     Confirm
                  </button>
               </motion.div>
            </AnimatePresence>
         ) : null}

         {isChangePassWord ? (
            <AnimatePresence>
               <motion.div className='bg-white p-4 rounded-lg shadow-lg w-90' initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ duration: 0.5 }}>
                  <h2 className='text-2xl font-bold text-center mb-6 text-gray-800'>Reset password</h2>
               </motion.div>
            </AnimatePresence>
         ) : null}
      </div>
   );
};

export default ForgotPassword;

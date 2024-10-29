/** @format */
import { AnimatePresence, motion } from "framer-motion";
import { updateAuth, updateForgotPassword, updateOtp } from "../../store/features/popupSlices";
import { useState } from "react";
import serviceAuth from "./serviceAuth";
import { addNoti } from "../../store/features/popupSlices";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import OtpInput from "react-otp-input";
import serviceChrome from "../services/ServiceChrome";
import { VscEyeClosed } from "react-icons/vsc";
import { VscEye } from "react-icons/vsc";

const ForgotPassword = ({ isOtp }) => {
   const [email, setEmail] = useState("");
   const [isForgotPassword, setForgotPassword] = useState(true);
   const [isVerifyOtp, setIsVerifyOtp] = useState(false);
   const [isChangePassWord, setIsChangePassword] = useState(false);
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [display, setDisplay] = useState({
      password: false,
      confirmPassword: false,
   });
   const [otp, setOtp] = useState("");
   const dispatch = useDispatch();
   const handleSubmitResetPassword = async (email) => {
      try {
         const response = await serviceAuth.forgotPassword(email);
         const { status, message } = response.data;
         if (status == 200) {
            setForgotPassword(false);
            setIsVerifyOtp(true);
            serviceChrome.setStateLocal(process.env.REACT_APP_TYPE_NAME_STATE_OTP_VARIABLE, true);
            serviceChrome.setStateLocal(process.env.REACT_APP_TYPE_NAME_EMAIL, email);
         }
         dispatch(addNoti({ message, id: uuidv4(), status }));
      } catch (error) {
         dispatch(addNoti({ message: "Email not found", id: uuidv4(), status: 400 }));
      }
   };
   const handleVerifyOtp = async (code) => {
      const email = await serviceChrome.getValueLocal(process.env.REACT_APP_TYPE_NAME_EMAIL);
      try {
         const response = await serviceAuth.verifyOtp(code.toString(), email);
         const { status, message } = response.data;
         if (status == 200) {
            setForgotPassword(false);
            setIsVerifyOtp(false);
            dispatch(updateOtp(false));
            dispatch(updateForgotPassword(true));
            setIsChangePassword(true);
         }
         dispatch(addNoti({ message, id: uuidv4(), status }));
      } catch (error) {
         dispatch(addNoti({ message: "Failed to verify OTP code", id: uuidv4(), status: 400 }));
      }
   };

   const checkPassword = (password, confirmPassword) => {
      if (password.length < 8 || confirmPassword.length < 8) {
         return true;
      }
      return false;
   };

   const handleChangePassword = async (password, confirmPassword) => {
      if (password !== confirmPassword) {
         dispatch(addNoti({ message: "Confirmation password is incorrect", id: uuidv4(), status: 400 }));
      } else {
         try {
            const email = await serviceChrome.getValueLocal(process.env.REACT_APP_TYPE_NAME_EMAIL);
            const response = await serviceAuth.changePassword(email, password);
            const { status, message } = response.data;
            if (status == 200) {
               setForgotPassword(false);
               setIsVerifyOtp(false);
               dispatch(updateOtp(false));
               dispatch(updateForgotPassword(false));
               serviceChrome.setStateLocal(process.env.REACT_APP_TYPE_NAME_STATE_OTP_VARIABLE, false);
               setIsChangePassword(false);
            }
            dispatch(addNoti({ message, id: uuidv4(), status }));
         } catch (error) {
            console.log(error);
         }
      }
   };
   return (
      <div>
         {isForgotPassword && !isOtp ? (
            <AnimatePresence>
               <motion.div className='bg-white p-4 rounded-lg shadow-lg w-80' initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.5 }}>
                  <h2 className='text-2xl font-bold text-center mb-6 text-gray-800'>Forgot password?</h2>
                  <p className='text-gray-400 mb-6 text-center'>No worries, we'll send you reset instructions.</p>
                  <form
                     onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmitResetPassword(email);
                     }}>
                     <input onChange={(e) => setEmail(e.target.value)} type='email' name='email' placeholder='Enter your email' className='w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none' required />
                     <button type='submit' className='w-full bg-custom-color-title text-white p-3 rounded-lg font-semibold transition duration-300'>
                        Reset password
                     </button>
                  </form>
                  <div className='mt-4 text-center'>
                     <span
                        onClick={() => {
                           dispatch(updateAuth(false));
                           dispatch(updateForgotPassword(false));
                        }}
                        className='block text-custom-color-title hover:underline cursor-pointer'>
                        Back to log in
                     </span>
                  </div>
               </motion.div>
            </AnimatePresence>
         ) : null}

         {isVerifyOtp || isOtp ? (
            <AnimatePresence>
               <motion.div className='bg-white p-4 rounded-lg shadow-lg w-90' initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ duration: 0.5 }}>
                  <h2 className='text-2xl font-bold text-center mb-6 text-gray-800'>Verify OTP code</h2>
                  <form
                     onSubmit={(e) => {
                        e.preventDefault();
                        handleVerifyOtp(otp);
                        setOtp("");
                     }}>
                     <OtpInput
                        value={otp}
                        onChange={(value) => {
                           setOtp(value);
                           console.log(value);
                        }}
                        numInputs={6}
                        renderSeparator={<span className='mx-2 text-gray-400'>-</span>}
                        renderInput={(props) => (
                           <input
                              {...props}
                              className='w-9 h-9 p-1 border-1 border-gray-300 rounded-sm text-center focus:border-custom-color-title focus:outline-none transition'
                              style={{
                                 fontSize: "0.75rem",
                              }}
                           />
                        )}
                     />
                     <button type='submit' className='w-full mt-4 px-4 py-2 bg-custom-color-title text-white rounded-lg transition'>
                        Confirm
                     </button>
                  </form>

                  <div className='mt-4 text-center'>
                     <span
                        onClick={() => {
                           serviceChrome.setStateLocal(process.env.REACT_APP_TYPE_NAME_STATE_OTP_VARIABLE, false);
                           dispatch(updateOtp(false));
                           setOtp("");
                           setIsVerifyOtp(false);
                           dispatch(updateForgotPassword(true));
                           setForgotPassword(true);
                        }}
                        className='block text-custom-color-title hover:underline cursor-pointer'>
                        Back to reset password to give new otp ocde
                     </span>
                  </div>
               </motion.div>
            </AnimatePresence>
         ) : null}

         {isChangePassWord ? (
            <AnimatePresence>
               <motion.div className='bg-white p-4 rounded-lg shadow-lg w-80' initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ duration: 0.5 }}>
                  <h2 className='text-2xl font-bold text-center mb-6 text-gray-800'>Reset password</h2>
                  <form
                     onSubmit={(e) => {
                        e.preventDefault();
                        handleChangePassword(password, confirmPassword);
                     }}>
                     <div className='mb-3'>
                        <label className='block text-gray-600 mb-1'>New password</label>
                        <div className='relative'>
                           <input
                              type={display.password ? "text" : "password"}
                              name='password'
                              className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none ${password.length < 8 ? "focus:border-red-500" : "focus:border-green-500"}`}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                              placeholder='Enter your new password'
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
                           {password !== "" && password.length < 8 ? (
                              <motion.div className='text-xs mt-1.5 text-gray-400' initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                                 Enter at least 8 characters
                              </motion.div>
                           ) : null}
                        </div>
                     </div>
                     <div className='mb-3'>
                        <label className='block text-gray-600 mb-1'>Confirm new password</label>
                        <div className='relative'>
                           <input
                              type={display.confirmPassword ? "text" : "password"}
                              name='confirmPassword'
                              className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none ${confirmPassword.length < 8 ? "focus:border-red-500" : "focus:border-green-500"}`}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              required
                              placeholder='Enter your confirm new password'
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
                           {confirmPassword !== "" && confirmPassword.length < 8 ? (
                              <motion.div className='text-xs mt-1.5 text-gray-400' initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                                 Enter at least 8 characters
                              </motion.div>
                           ) : null}
                        </div>
                     </div>

                     <button
                        disabled={checkPassword(password, confirmPassword)}
                        type='submit'
                        className={`w-full mt-4 px-4 py-2 ${password.length >= 8 && confirmPassword.length >= 8 ? "bg-custom-color-title" : "opacity-50 cursor-not-allowed"} bg-custom-color-title text-white rounded-lg transition'`}>
                        Confirm
                     </button>
                  </form>
                  <div className='mt-4 text-center'>
                     <span
                        onClick={() => {
                           serviceChrome.setStateLocal(process.env.REACT_APP_TYPE_NAME_STATE_OTP_VARIABLE, false);
                           dispatch(updateOtp(false));
                           setIsChangePassword(false);
                           dispatch(updateForgotPassword(true));
                           setForgotPassword(true);
                        }}
                        className='block text-custom-color-title hover:underline cursor-pointer'>
                        Back to reset password to give new otp code
                     </span>
                  </div>
               </motion.div>
            </AnimatePresence>
         ) : null}
      </div>
   );
};

export default ForgotPassword;

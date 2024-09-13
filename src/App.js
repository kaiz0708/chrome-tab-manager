/** @format */

import React, { useEffect, useRef, useState } from "react";
import Popup from "./components/popup/popup";
import { Route, Routes, useNavigate } from "react-router-dom";
import MainPage from "./components/page/MainPage";
/* global chrome */
function App() {
   const [check, useCheck] = useState(true);
   return (
      <div>
         <Routes>
            {check === true ? (
               <Popup />
            ) : (
               <Route path='/main-page' element={<MainPage />} />
            )}
         </Routes>
         <Popup />
      </div>
   );
}

export default App;

/** @format */

import React, { useState, useRef, useEffect } from "react";
import { AppBar, Toolbar, Button, Slide } from "@mui/material";

function Collection() {
   const [showNavbar, setShowNavbar] = useState(false);

   const handleClick = () => {
      setShowNavbar(!showNavbar);
   };

   return (
      <div
         style={{
            position: "relative",
            paddingBottom: "56px",
         }}>
         <Button onClick={handleClick}>Toggle Navbar</Button>

         <Slide direction='up' in={showNavbar} mountOnEnter unmountOnExit>
            <div>
               <div position='absolute' style={{ bottom: 0, height: "56px" }}>
                  {" "}
                  {/* Đặt AppBar ở cuối */}
                  <Toolbar>
                     <h1 style={{ color: "#fff" }}>Navbar</h1>
                  </Toolbar>
               </div>
            </div>
         </Slide>
      </div>
   );
}

export default Collection;

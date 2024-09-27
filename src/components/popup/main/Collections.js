/** @format */

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useDrag, useDrop } from "react-dnd";
import serviceChrome from "../../services/ServiceChrome";
import WindowTab from "./WindowTab";
import { setValue } from "../../../store/features/collectionSlices";
import { useDispatch, useSelector } from "react-redux";
import { Grid2 } from "@mui/material";
import utils from "../../../common/utils";
/* global chrome */

function Collection() {
   const dropRef = useRef(null);
   const windowTabs = useSelector((state) => state.collection.value);
   const dispatch = useDispatch();
   const forCollection = useRef(false);
   const typeDisplay = useSelector((state) => state.current.displayState);

   useEffect(() => {
      chrome.storage.sync.get(process.env.REACT_APP_TYPE_NAME_INFORBASE_VARIABLE, (result) => {
         let fieldNamesMain = ["id", "name", "date"];
         let fieldNamesUrl = ["id", "url"];
         let urls = "";
         const amountUrl = 12;

         for (let i = 0; i < amountUrl; i++) {
            chrome.storage.sync.get(process.env.REACT_APP_TYPE_NAME_URL_VARIABLE + i, (result) => {
               if (result[process.env.REACT_APP_TYPE_NAME_URL_VARIABLE + i] !== "") {
                  if (i != 0) {
                     urls = urls + ":::" + result[process.env.REACT_APP_TYPE_NAME_URL_VARIABLE + i].toString();
                  } else {
                     urls = urls + result[process.env.REACT_APP_TYPE_NAME_URL_VARIABLE + i].toString();
                  }
               }
               console.log("urls", urls);

               const res = utils.parseStringToObjects(result[process.env.REACT_APP_TYPE_NAME_INFORBASE_VARIABLE], ":::", ";", fieldNamesMain);

               const resUrl = utils.parseStringToObjects(urls, ":::", ";", fieldNamesUrl);

               let combined = utils.combineObjects(res, resUrl, "id");

               console.log(combined);
            });
         }
      });
   }, []);

   const [{ isOver }, drop] = useDrop({
      accept: "ITEM",
      drop: (item, monitor) => {
         if (monitor.didDrop()) {
            return;
         }
         serviceChrome.openWindowGroup([item.tab]);
      },
      collect: (monitor) => ({
         isOver: !!monitor.isOver(),
      }),
   });

   const combinedRef = (el) => {
      dropRef.current = el;
      drop(el);
   };

   return (
      <motion.div ref={combinedRef} initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }} transition={{ duration: 0.3 }} className='absolute'>
         <div className=''>
            <Grid2 spacing={1} columns={{ xs: 3, sm: 3, md: 3 }} container>
               {windowTabs.map((windowTab, index) => (
                  <Grid2 size={{ xs: 1, sm: 1, md: 1 }} key={index}>
                     <WindowTab
                        window={{
                           windowTab,
                           index,
                           typeDisplay: typeDisplay,
                           for: forCollection.current,
                        }}
                     />
                  </Grid2>
               ))}
            </Grid2>
         </div>
      </motion.div>
   );
}

export default Collection;

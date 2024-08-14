/** @format */

import React, { useState, useEffect, useRef } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { AiOutlineDelete } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
/* global chrome */
function App() {
   const [windowTabs, setWindowTabs] = useState([]);
   const [tabs, setTabs] = useState([]);
   const [showTooltip, setShowTooltip] = useState(false);
   const [tabHoverId, setTabHoverId] = useState();
   const [windowCurrent, setWindowCurrent] = useState([]);
   const [showCloseTab, setShowCloseTab] = useState(false);
   const [activeTab, setActiveTab] = useState(true);
   const hoverTimeoutRef = useRef(null);

   useEffect(() => {
      chrome.windows.getAll({ populate: true }, function (windows) {
         setWindowTabs(windows);
         setWindowCurrent([windows[0].id]);
      });
   }, []);

   const closeTab = (tabId) => {
      chrome.tabs.remove(tabId, () => {
         setTabs(tabs.filter((tab) => tab.id !== tabId));
      });
   };

   const addNewEmptyTab = () => {
      chrome.tabs.create({}, (newTab) => {
         setTabs([...tabs, newTab]);
      });
   };

   const switchToTab = (tabId) => {
      chrome.tabs.update(tabId, { active: true }, () => {
         chrome.windows.update(tabs.find((tab) => tab.id === tabId).windowId, {
            focused: true,
         });
      });
   };

   const statusListWindowTab = (windowId, status) => {
      if (status === "Open") {
         setWindowCurrent((prevWindowCurrent) => [
            ...prevWindowCurrent,
            windowId,
         ]);
      } else {
         setWindowCurrent((prevWindowCurrent) =>
            prevWindowCurrent.filter((winId) => winId !== windowId)
         );
      }
   };

   const checkWindowOpenOrClose = (winId) => {
      return windowCurrent.includes(winId);
   };

   const delayTimeDisplayDescription = () => {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = setTimeout(() => {
         setShowTooltip(true);
      }, 800);
   };

   const handleMouseLeave = () => {
      clearTimeout(hoverTimeoutRef.current);
      setShowCloseTab(false);
      setShowTooltip(false);
   };

   const checkActveTab = (tab, hover) => {
      if (tab && hover) {
         setActiveTab(false);
      } else {
         setActiveTab(true);
      }
   };

   return (
      <div className='w-full p-2 font-sans text-xs font-normal text-custom-black'>
         <h1 className='text-2xl font-normal mb-4 text-custom-color-title text-center'>
            Chrome Tab Manager
         </h1>
         <div></div>
         {windowTabs.map((windowTab, index) => (
            <div className='p-2 shadow-custom rounded-md'>
               <div className='flex'>
                  window : {index + 1}
                  <IoIosArrowForward
                     onClick={() => statusListWindowTab(windowTab.id, "close")}
                  />
                  <IoIosArrowDown
                     onClick={() => statusListWindowTab(windowTab.id, "Open")}
                  />
               </div>
               <h3>amount tab : {windowTab.tabs.length}</h3>
               <div
                  className={`transition-all duration-1000 ease-in-out overflow-hidden ${
                     checkWindowOpenOrClose(windowTab.id)
                        ? "max-h-[1000px] opacity-100 transform translate-y-0"
                        : "max-h-0 opacity-0 transform -translate-y-4"
                  }`}>
                  {windowTab.tabs.map((tab) => (
                     <div className='relative'>
                        <div
                           onClick={() => switchToTab(tab.id)}
                           onMouseEnter={() => {
                              setShowCloseTab(true);
                              setTabHoverId(tab.id);
                              checkActveTab(tab.active, true);
                              delayTimeDisplayDescription();
                           }}
                           onMouseLeave={() => {
                              handleMouseLeave();
                              checkActveTab(tab.active, false);
                           }}
                           className='hover:bg-custom-color-tooltip hover:border-1 transition-all z-10 duration-400 ease-in-out flex space-x-1 h-10 items-center border-g cursor-pointer shadow-custom hover:shadow-md hover:p-3 justify-between p-1 border-solid rounded'>
                           <div className='w-5'>
                              <img
                                 className='w-100% rounded-sm'
                                 src={tab.favIconUrl}
                              />
                           </div>
                           <p className='truncate flex-1 mr-2'>{tab.title}</p>
                           {activeTab && tab.active ? (
                              <div>
                                 {tab.active ? (
                                    <span className='ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-green-500 text-white'>
                                       active
                                    </span>
                                 ) : (
                                    <span></span>
                                 )}
                              </div>
                           ) : (
                              <div></div>
                           )}
                           {showCloseTab && tabHoverId == tab.id ? (
                              <IoIosClose
                                 onClick={() => closeTab(tab.id)}
                                 className=' hover:bg-custom-pink cursor-pointer text-white bg-gray-200 tex rounded-full text-base transition duration-300 ease-in-out'
                              />
                           ) : (
                              <div></div>
                           )}
                        </div>

                        <div>
                           {showTooltip && tabHoverId == tab.id ? (
                              <div
                                 className='absolute w-full z-20 px-2 text-xs py-2 font-normal text-black bg-custom-hover-gray transition-all duration-100 ease-in-out rounded-lg shadow-sm tooltip dark:bg-gray-700'
                                 style={{
                                    top: "calc(100% + 8px)",
                                    left: "0",
                                    transform: "none",
                                 }}>
                                 {tab.title}
                              </div>
                           ) : (
                              <div
                                 className='tooltip-arrow'
                                 data-popper-arrow></div>
                           )}
                        </div>
                     </div>
                  ))}
                  <button
                     onClick={() => addNewEmptyTab()}
                     className='bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm'>
                     Thêm tab
                  </button>
               </div>
            </div>
         ))}
      </div>
   );
}

export default App;

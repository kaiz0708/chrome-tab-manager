/** @format */

import React, { useState, useEffect, useRef } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { AiOutlineDelete } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { IoEarthOutline } from "react-icons/io5";
import { CiSquarePlus } from "react-icons/ci";
import { PiTrashLight } from "react-icons/pi";
import WindowTab from "./components/popup/WindowTab";
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

   const closeTab = (tabId, windowId) => {
      chrome.tabs.query({ windowId: windowId }, (tabs) => {
         chrome.tabs.remove(tabId);
      });
   };

   const addNewEmptyTab = (windowId) => {
      chrome.tabs.query({ windowId: windowId }, (tabs) => {
         chrome.tabs.create({});
      });
   };

   const closeAllTabWindows = (windowCurrentId) => {
      chrome.windows.remove(windowCurrentId, () => {
         // Có thể thêm logic sau khi cửa sổ được đóng nếu cần
         console.log(`Window ${windowCurrentId} has been closed.`);
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
      if (status === "open") {
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
      }, 1000);
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
   const TabList = ({ tabs }) => {
      const visibleTabs = 2;

      return (
         <span>
            {tabs.length <= visibleTabs ? (
               tabs.map((tab) => <span>{new URL(tab.url).hostname}</span>)
            ) : (
               <span>
                  {tabs.slice(0, visibleTabs).map((tab) => (
                     <span>{new URL(tab.url).hostname.split(".")[1]}, </span>
                  ))}
                  <span>{tabs.length - visibleTabs} more</span>
               </span>
            )}
         </span>
      );
   };

   return (
      <div className='w-full p-2 font-sans text-xs font-normal text-custom-black'>
         <h1 className='text-2xl font-normal mb-4 text-custom-color-title text-center'>
            Chrome Tab Manager
         </h1>
         <div></div>
         {windowTabs.map((windowTab, index) => (
            <WindowTab window={{ windowTab, index, windowCurrent }} />
            // <div className='p-2 shadow-custom rounded-md z-10 space-y-3'>
            //    <div className='flex justify-between items-center'>
            //       <span className='text-custom-color-title text-xs font-semibold'>
            //          Window : {index + 1}
            //       </span>
            //       <div
            //          onClick={() => {
            //             checkWindowOpenOrClose(windowTab.id)
            //                ? statusListWindowTab(windowTab.id, "close")
            //                : statusListWindowTab(windowTab.id, "open");
            //          }}
            //          className='flex items-center justify-center p-1 bg-gray-300 rounded-full cursor-pointer hover:bg-custom-pink transition duration-300 ease-in-out'>
            //          {checkWindowOpenOrClose(windowTab.id) ? (
            //             <IoIosArrowDown className='text-xs text-white transition-transform duration-300 ease-in-out transform rotate-0' />
            //          ) : (
            //             <IoIosArrowForward className='text-xs text-white transition-transform duration-300 ease-in-out transform rotate-0' />
            //          )}
            //       </div>
            //    </div>
            //    <span className='text-xs font-medium text-center'>
            //       Total : {windowTab.tabs.length}
            //    </span>

            //    <div
            //       className={`transition-all duration-300 ease-in-out ${
            //          checkWindowOpenOrClose(windowTab.id)
            //             ? "max-h-[1000px] opacity-100 transform translate-y-0 overflow-visible"
            //             : "max-h-0 opacity-0 transform -translate-y-4 overflow-hidden"
            //       }`}>
            //       {windowTab.tabs.map((tab) => (
            //          <div className='relative'>
            //             <div
            //                onClick={() => switchToTab(tab.id)}
            //                onMouseEnter={() => {
            //                   setShowCloseTab(true);
            //                   setTabHoverId(tab.id);
            //                   checkActveTab(tab.active, true);
            //                   delayTimeDisplayDescription();
            //                }}
            //                onMouseLeave={() => {
            //                   handleMouseLeave();
            //                   checkActveTab(tab.active, false);
            //                }}
            //                className='hover:bg-custom-color-tooltip hover:border-1 transition-all z-10 duration-400 ease-in-out flex space-x-1 h-10 items-center border-g cursor-pointer hover:shadow-md hover:p-3 justify-between p-1 border-solid rounded'>
            //                <div className='w-5'>
            //                   {tab.favIconUrl != null ? (
            //                      <img
            //                         className='w-100% rounded-sm'
            //                         src={tab.favIconUrl}
            //                      />
            //                   ) : (
            //                      <div className='h-5 bg-gray-100 rounded-sm flex justify-center items-center'>
            //                         <IoEarthOutline className='text-xs' />
            //                      </div>
            //                   )}
            //                </div>
            //                <p className='truncate flex-1 mr-2'>{tab.title}</p>
            //                {activeTab && tab.active ? (
            //                   <div>
            //                      {tab.active ? (
            //                         <span className='ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-green-500 text-white'>
            //                            active
            //                         </span>
            //                      ) : (
            //                         <span></span>
            //                      )}
            //                   </div>
            //                ) : (
            //                   <div></div>
            //                )}
            //                {showCloseTab && tabHoverId == tab.id ? (
            //                   <IoIosClose
            //                      onClick={() => closeTab(tab.id, windowTab.id)}
            //                      className=' hover:bg-custom-pink cursor-pointer text-white bg-gray-200 rounded-full text-base transition duration-300 ease-in-out'
            //                   />
            //                ) : (
            //                   <div></div>
            //                )}
            //             </div>

            //             <div>
            //                {showTooltip && tabHoverId == tab.id ? (
            //                   <div
            //                      className='absolute w-full z-[999] px-2 text-xs py-2 font-normal text-black bg-custom-hover-gray transition-all duration-200 ease-[cubic-bezier(0.25, 0.1, 0.25, 1)] rounded-lg shadow-sm tooltip dark:bg-gray-700'
            //                      style={{
            //                         top: "calc(100% + 5px)",
            //                         left: "0",
            //                         transform: "none",
            //                      }}>
            //                      {tab.title}
            //                   </div>
            //                ) : (
            //                   <div
            //                      className='tooltip-arrow'
            //                      data-popper-arrow></div>
            //                )}
            //             </div>
            //          </div>
            //       ))}
            //    </div>
            //    <div className='z-10 flex justify-end'>
            //       <div className='cursor-pointer'>
            //          <CiSquarePlus
            //             onClick={() => {
            //                addNewEmptyTab(windowTab.id);
            //             }}
            //             className='size-6'
            //          />
            //       </div>

            //       <div>
            //          <PiTrashLight
            //             onClick={() => {
            //                closeAllTabWindows(windowTab.id);
            //             }}
            //             className='size-6'
            //          />
            //       </div>
            //    </div>
            // </div>
         ))}
      </div>
   );
}

export default App;

import React, { useState, useEffect, useRef } from 'react';
import { AiOutlineCloseCircle } from "react-icons/ai";
import { AiOutlineDelete } from "react-icons/ai";
import { IoIosClose } from "react-icons/io";
/* global chrome */
function App() {
  const [windowTabs, setWindowTabs] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tabHoverId, setTabHoverId] =  useState()
  const [windowCurrent, setWindowCurrent] = useState([])
  const [showCloseTab, setShowCloseTab] = useState(false)
  const hoverTimeoutRef = useRef(null);
  const [check, setCheck] = useState(0)

  useEffect(() => {
    chrome.windows.getAll({populate: true}, function(windows) {
      setWindowTabs(windows)
      setWindowCurrent([])
    });
  }, []);

  const closeTab = (tabId) => {
    chrome.tabs.remove(tabId, () => {
      setTabs(tabs.filter(tab => tab.id !== tabId));
    });
  };

  const addNewEmptyTab = () => {
    chrome.tabs.create({}, (newTab) => {
      setTabs([...tabs, newTab]);
    });
  };

  const switchToTab = (tabId) => {
    chrome.tabs.update(tabId, { active: true }, () => {
      chrome.windows.update(tabs.find(tab => tab.id === tabId).windowId, { focused: true });
    });
  };

  const statusListWindowTab = (windowId, status) => {
    if (status === 'Open') {
      setWindowCurrent(prevWindowCurrent => [...prevWindowCurrent, windowId]);
    } else {
      setWindowCurrent(prevWindowCurrent => prevWindowCurrent.filter(winId => winId !== windowId));
    }
  }

  const checkWindowOpenOrClose = (winId) => {
    return windowCurrent.includes(winId)
  }

  const delayTimeDisplayDescription = () => {
    clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setShowTooltip(true)
    }, 800);
  }

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeoutRef.current);
    setShowCloseTab(false)
    setShowTooltip(false)
  };



  return (
    <div className="w-full p-2 font-sans text-xs font-normal text-custom-black">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Chrome Tab Manager</h1>
      <div>

      </div>
      {windowTabs.map(windowTab => (
        <div className='p-2 shadow-custom rounded-md'>
          <h3>window : {windowTab.id} <span onClick={() => statusListWindowTab(windowTab.id, "close")} >Đóng</span>  <span onClick={() => statusListWindowTab(windowTab.id, "Open")} >Mở</span> </h3>
          <h3>amount tab : {windowTab.tabs.length}</h3>
            {checkWindowOpenOrClose(windowTab.id) == true ? 
                  <div className="space-y-2 transition-all duration-200 ease-in-out">
                  {windowTab.tabs.map(tab => (
                      <div className='relative'>
                        <div
                        onClick={() => switchToTab(tab.id)} 
                        onMouseEnter={() => {
                          setShowCloseTab(true)
                          setTabHoverId(tab.id)
                          delayTimeDisplayDescription()
                        }}
                        onMouseLeave={() => {
                          handleMouseLeave()
                        }}
                        className="hover:bg-custom-color-tooltip hover:border-1 transition-all z-10 duration-200 ease-in-out flex h-10 items-center border-g cursor-pointer shadow-custom hover:shadow-md hover:p-2 justify-between p-1 border-solid rounded">
                        <div className='w-5' >
                          <img className="w-100%" src={tab.favIconUrl} />
                        </div>
                        <p className="truncate flex-1 mr-2">{tab.title}</p>
                        <span>{tab.active ? <b>Active</b> : <b></b>}</span>
                        {showCloseTab && tabHoverId == tab.id ? <IoIosClose onClick={() => closeTab(tab.id)} className=" hover:bg-custom-pink cursor-pointer text-white bg-gray-200 tex rounded-full text-base transition duration-300 ease-in-out" />
                          : <div></div>}
                      </div>
                      
                      <div>
                        {showTooltip && tabHoverId == tab.id ? 
                          <div className="absolute w-full z-20 px-2 text-xs py-2 font-normal text-black bg-custom-hover-gray transition-all duration-100 ease-in-out rounded-lg shadow-sm tooltip dark:bg-gray-700"
                          style={{top: 'calc(100% + 8px)', left: '0', transform: 'none'}}>
                          {tab.title}
                          </div> : 
                          <div className="tooltip-arrow" data-popper-arrow></div>}
                      </div>
                    </div>
                  ))}
                <button 
                      onClick={() => addNewEmptyTab()}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                    >
                      Thêm tab
                    </button>
              </div>: <div></div>

            }
            
        </div>
      ))}
    </div>
  );
}

export default App;

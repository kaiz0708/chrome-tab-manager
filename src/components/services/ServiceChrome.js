/** @format */
/* global chrome */

export default {
   switchToWindow: (windowCurrent) => {
      chrome.windows.update(windowCurrent, { focused: true }, () => {
         console.log(`Switched to window with ID: ${windowCurrent}`);
      });
   },

   switchToTab: (tabId) => {
      chrome.tabs.update(tabId, { active: true }, () => {
         console.log(`Switched to tab with ID: ${tabId}`);
      });
   },

   openNewTabEmpty: (windowId) => {
      chrome.tabs.create(
         {
            windowId: windowId,
         },
         (newTab) => {
            if (chrome.runtime.lastError) {
               console.error(
                  "Error creating new tab:",
                  chrome.runtime.lastError
               );
            } else {
               console.log("New tab created successfully:", newTab);
            }
         }
      );
   },

   closeTab: (tabId, windowId) => {
      chrome.tabs.query({ windowId: windowId }, (tabs) => {
         chrome.tabs.remove(tabId);
      });
   },

   openWindow: () => {
      chrome.windows.create(
         {
            url: "chrome://newtab",
            type: "normal",
            focused: true,
         },
         (window) => {
            console.log(window);
         }
      );
   },

   closeWindow: (windowCurrentId) => {
      chrome.windows.remove(windowCurrentId, () => {
         console.log("delete success");
      });
   },

   minimizeWindow: (windowCurrentId) => {
      chrome.windows.update(windowCurrentId, { state: "minimized" });
   },
};

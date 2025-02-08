/** @format */
/* global chrome */

const serviceChrome = {
   switchToWindow: (windowCurrent) => {
      chrome.windows.update(windowCurrent, { focused: true }, () => {});
   },

   switchToTab: (tabId) => {
      chrome.tabs.update(tabId, { active: true }, () => {});
   },

   moveTab: (tabId, indexHover, windowIdHover) => {
      chrome.tabs.move(tabId, { windowId: windowIdHover, index: -1 }, (tab) => {
         if (chrome.runtime.lastError) {
         } else {
            chrome.tabs.move(tabId, { index: indexHover }, (movedTab) => {
               if (chrome.runtime.lastError) {
               } else {
               }
            });
         }
      });
   },

   openNewTabEmpty: (windowId, url, state) => {
      chrome.tabs.create(
         {
            windowId: windowId,
            url: url,
            active: state,
         },
         (newTab) => {
            if (chrome.runtime.lastError) {
            } else {
            }
         }
      );
   },

   closeTab: (tabId, windowId) => {
      chrome.tabs.query({ windowId: windowId }, (tabs) => {
         chrome.tabs.remove(tabId);
      });
   },

   pinTab: () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
         let currentTab = tabs[0];
         let pinnedStatus = !currentTab.pinned;
         chrome.tabs.update(currentTab.id, { pinned: pinnedStatus });
      });
   },

   openWindow: (tabUrl) => {
      chrome.windows.create({
         url: tabUrl,
         type: "normal",
         focused: false,
      });
   },

   openWindowGroup: (urls) => {
      chrome.windows.create(
         {
            focused: true,
            url: "chrome://newtab",
         },
         (window) => {
            chrome.tabs.query({ windowId: window.id }, function (tabs) {
               let activeTab = tabs[0];
               chrome.tabs.remove(activeTab.id, function () {});
            });
            let index = 0;
            urls.forEach((url, indx) => {
               chrome.tabs.move(url.id, { windowId: window.id, index: -1 }, (tab) => {
                  chrome.tabs.move(url.id, { index: index }, (movedTab) => {});
               });
               index = index + 1;
            });
         }
      );
   },

   closeWindow: (windowCurrentId) => {
      chrome.windows.remove(windowCurrentId, () => {});
   },

   minimizeWindow: (windowCurrentId) => {
      chrome.windows.update(windowCurrentId, { state: "minimized" });
   },

   createState: () => {
      chrome.storage.local.get(process.env.REACT_APP_TYPE_NAME_VIEW_VARIABLE, (result) => {
         if (result[process.env.REACT_APP_TYPE_NAME_VIEW_VARIABLE] === undefined) {
            chrome.storage.local.set({ [process.env.REACT_APP_TYPE_NAME_VIEW_VARIABLE]: process.env.REACT_APP_TYPE_TAB_HORIZONTAL }, () => {});
         }
      });

      chrome.storage.local.get(process.env.REACT_APP_TYPE_NAME_STATE_OTP_VARIABLE, (result) => {
         if (result[process.env.REACT_APP_TYPE_NAME_STATE_OTP_VARIABLE] === undefined) {
            chrome.storage.local.set({ [process.env.REACT_APP_TYPE_NAME_STATE_OTP_VARIABLE]: false }, () => {});
         }
      });

      chrome.storage.local.get(process.env.REACT_APP_TYPE_NAME_EMAIL, (result) => {
         if (result[process.env.REACT_APP_TYPE_NAME_EMAIL] === undefined) {
            chrome.storage.local.set({ [process.env.REACT_APP_TYPE_NAME_EMAIL]: "" }, () => {});
         }
      });
   },

   setStateLocal: (field, value) => {
      chrome.storage.local.set({ [field]: value }, () => {});
   },

   setStateSync: (field, value) => {
      chrome.storage.sync.set({ [field]: value }, function () {});
   },

   sendMessage: (data, message) => {
      chrome.runtime.sendMessage({ data, type: message }, (response) => {});
   },

   getValueLocal: (key) => {
      return new Promise((resolve) => {
         chrome.storage.local.get([key], (value) => {
            resolve(value[key]);
         });
      });
   },

   removeValueLocal: (keyList) => {
      chrome.storage.local.remove(keyList, function () {});
   },
};

export default serviceChrome;

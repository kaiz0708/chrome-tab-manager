/** @format */
/* global chrome */

const serviceChrome = {
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

   moveTab: (tabId, indexHover, windowIdHover) => {
      chrome.tabs.move(tabId, { windowId: windowIdHover, index: -1 }, (tab) => {
         if (chrome.runtime.lastError) {
            console.error(`Lỗi khi di chuyển tab: ${chrome.runtime.lastError.message}`);
         } else {
            console.log(`Tab ${tabId} đã được di chuyển đến cửa sổ ${windowIdHover}.`);

            // Cập nhật vị trí của tab trong cửa sổ mục tiêu
            chrome.tabs.move(tabId, { index: indexHover }, (movedTab) => {
               if (chrome.runtime.lastError) {
                  console.error(`Lỗi khi thay đổi vị trí của tab: ${chrome.runtime.lastError.message}`);
               } else {
                  console.log(`Tab ${tabId} đã được di chuyển đến vị trí ${indexHover} trong cửa sổ ${windowIdHover}.`);
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
               console.error("Error creating new tab:", chrome.runtime.lastError);
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
      console.log(urls);
      chrome.windows.create(
         {
            focused: true,
            url: "chrome://newtab",
         },
         (window) => {
            chrome.tabs.query({ windowId: window.id }, function (tabs) {
               let activeTab = tabs[0];
               chrome.tabs.remove(activeTab.id, function () {
                  console.log(`Tab đang hoạt động đã được xóa.`);
               });
            });
            let index = 0;
            urls.forEach((url, indx) => {
               chrome.tabs.move(url.id, { windowId: window.id, index: -1 }, (tab) => {
                  chrome.tabs.move(url.id, { index: index }, (movedTab) => {
                     console.log(movedTab);
                  });
               });
               index = index + 1;
            });
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

   createState: () => {
      chrome.storage.local.get(process.env.REACT_APP_TYPE_NAME_VIEW_VARIABLE, (result) => {
         if (result[process.env.REACT_APP_TYPE_NAME_VIEW_VARIABLE] === undefined) {
            chrome.storage.local.set({ [process.env.REACT_APP_TYPE_NAME_VIEW_VARIABLE]: process.env.REACT_APP_TYPE_TAB_HORIZONTAL }, () => {
               console.log("Đối tượng đã được lưu.");
            });
         }
      });

      chrome.storage.local.get(process.env.REACT_APP_TYPE_NAME_STATE_OTP_VARIABLE, (result) => {
         console.log(result[process.env.REACT_APP_TYPE_NAME_STATE_OTP_VARIABLE]);
         if (result[process.env.REACT_APP_TYPE_NAME_STATE_OTP_VARIABLE] === undefined) {
            chrome.storage.local.set({ [process.env.REACT_APP_TYPE_NAME_STATE_OTP_VARIABLE]: false }, () => {
               console.log("Đối tượng đã được lưu.");
            });
         }
      });

      chrome.storage.local.get(process.env.REACT_APP_TYPE_NAME_EMAIL, (result) => {
         console.log(result[process.env.REACT_APP_TYPE_NAME_EMAIL]);
         if (result[process.env.REACT_APP_TYPE_NAME_EMAIL] === undefined) {
            chrome.storage.local.set({ [process.env.REACT_APP_TYPE_NAME_EMAIL]: "" }, () => {
               console.log("Đối tượng đã được lưu.");
            });
         }
      });
   },

   setStateLocal: (field, value) => {
      chrome.storage.local.set({ [field]: value }, () => {
         console.log("Đối tượng đã được lưu.");
      });
   },

   setStateSync: (field, value) => {
      chrome.storage.sync.set({ [field]: value }, function () {
         console.log("Đối tượng đã được lưu.");
      });
   },

   sendMessage: (data, message) => {
      chrome.runtime.sendMessage({ data, type: message }, (response) => {
         console.log("Response from background:", response);
      });
   },

   getValueLocal: (key) => {
      return new Promise((resolve) => {
         chrome.storage.local.get([key], (value) => {
            resolve(value[key]);
         });
      });
   },

   removeValueLocal: (keyList) => {
      chrome.storage.local.remove(keyList, function () {
         console.log("remove key success");
      });
   },
};

export default serviceChrome;

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
         focused: true,
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
      const keys = ["view", "collection"];
      const keyCollections = ["inforBase"];
      const amountUrl = 12;
      const valueDefaults = [process.env.REACT_APP_TYPE_TAB_HORIZONTAL, false];
      chrome.storage.local.get(keys, (result) => {
         keys.forEach((key, index) => {
            if (result[key] === undefined) {
               chrome.storage.local.set({ [key]: valueDefaults[index] }, () => {
                  console.log("Đối tượng đã được lưu.");
               });
            }
         });
      });

      chrome.storage.sync.get([keyCollections[0]], function (result) {
         if (result[keyCollections[0]] === undefined) {
            chrome.storage.sync.set({ [keyCollections[0]]: "0;Test;27/09/2024:::1;Test1;28/09/2024" }, () => {
               console.log("Đối tượng đã được lưu.");
            });
         } else {
            console.log(result[keyCollections[0]]);
         }
      });

      for (let index = 0; index < amountUrl; index++) {
         let defauls_url = "url_";
         chrome.storage.sync.get([defauls_url + index], function (result) {
            if (result[defauls_url + index] === undefined) {
               chrome.storage.sync.set({ [defauls_url + index]: "" }, () => {
                  console.log("Đối tượng đã được lưu.");
               });
            } else {
               console.log(result[defauls_url + index]);
            }
         });
      }
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
            resolve(value.token);
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

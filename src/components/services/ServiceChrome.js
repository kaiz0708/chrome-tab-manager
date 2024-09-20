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
            console.error(
               `Lỗi khi di chuyển tab: ${chrome.runtime.lastError.message}`
            );
         } else {
            console.log(
               `Tab ${tabId} đã được di chuyển đến cửa sổ ${windowIdHover}.`
            );

            // Cập nhật vị trí của tab trong cửa sổ mục tiêu
            chrome.tabs.move(tabId, { index: indexHover }, (movedTab) => {
               if (chrome.runtime.lastError) {
                  console.error(
                     `Lỗi khi thay đổi vị trí của tab: ${chrome.runtime.lastError.message}`
                  );
               } else {
                  console.log(
                     `Tab ${tabId} đã được di chuyển đến vị trí ${indexHover} trong cửa sổ ${windowIdHover}.`
                  );
               }
            });
         }
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
      chrome.windows.create(
         {
            focused: true,
         },
         (window) => {
            let index = 0;
            urls.forEach((url) => {
               chrome.tabs.move(
                  url.id,
                  { windowId: window.id, index: -1 },
                  (tab) => {
                     chrome.tabs.move(url.id, { index: index }, (movedTab) => {
                        console.log(movedTab);
                     });
                  }
               );
               index = index + 1;
            });
            chrome.tabs.query({ windowId: window.id }, function (tabs) {
               let activeTab = tabs[0]; // Lấy tab đang hoạt động
               chrome.tabs.remove(activeTab.id, function () {
                  console.log(`Tab đang hoạt động đã được xóa.`);
               });
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
};

export default serviceChrome;

/** @format */

let windowTabMapping = {}; // Để lưu trữ mapping giữa windowId và tabId

// Khi cửa sổ mới được tạo
chrome.windows.onCreated.addListener((window) => {
   // Lưu trữ thông tin về cửa sổ mới
   windowTabMapping[window.id] = [];
});

// Khi tab mới được tạo
chrome.tabs.onCreated.addListener((tab) => {
   const windowId = tab.windowId;
   if (windowTabMapping[windowId]) {
      windowTabMapping[windowId].push(tab.id);
   }
});

// Khi tab bị đóng
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
   const windowId = removeInfo.windowId;
   if (windowTabMapping[windowId]) {
      windowTabMapping[windowId] = windowTabMapping[windowId].filter(
         (id) => id !== tabId
      );
   }
});

// Khi cửa sổ bị đóng
chrome.windows.onRemoved.addListener((windowId) => {
   delete windowTabMapping[windowId];
});

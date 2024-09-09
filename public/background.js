/** @format */

chrome.tabs.onCreated.addListener(function (tab) {
   chrome.runtime.sendMessage({
      type: "ADD_TAB_CHROME",
      data: {
         newTab: tab,
         windowId: tab.windowId,
      },
   });
});

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
   chrome.runtime.sendMessage({
      type: "DELETE_TAB_CHROME",
      data: {
         tabId: tabId,
      },
   });
});

chrome.windows.onRemoved.addListener(function (windowId) {
   chrome.runtime.sendMessage({
      type: "CLOSE_WINDOW_CHROME",
      data: {
         windowId,
      },
   });
});

chrome.windows.onCreated.addListener(function (window) {
   chrome.tabs.query({ windowId: window.id }, function (tabs) {
      window.tabs = tabs;
      chrome.runtime.sendMessage({
         type: "OPEN_WINDOW_CHROME",
         data: {
            window,
         },
      });
   });
});

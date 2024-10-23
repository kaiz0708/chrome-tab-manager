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

chrome.tabs.onMoved.addListener((tabId, moveInfo) => {
   chrome.runtime.sendMessage({
      type: "MOVE_TAB_AROUND_WINDOW_CHROME",
      data: {
         fromIndex: moveInfo.fromIndex,
         toIndex: moveInfo.toIndex,
         windowId: moveInfo.windowId,
      },
   });
});

chrome.tabs.onAttached.addListener((tabId, attachInfo) => {
   chrome.runtime.sendMessage({
      type: "MOVE_TAB_WITHOUT_WINDOW_CHROME",
      data: {
         tabId: tabId,
         newPosition: attachInfo.newPosition,
         newWindowId: attachInfo.newWindowId,
      },
   });
});

chrome.tabs.onActivated.addListener((activeInfo) => {
   chrome.tabs.get(activeInfo.tabId, (tab) => {
      chrome.runtime.sendMessage({
         type: "ACTIVE_TAB",
         data: {
            tabId: tab.id,
            windowId: tab.windowId,
         },
      });
   });
});

chrome.webNavigation.onCompleted.addListener(function (details) {
   chrome.tabs.get(details.tabId, function (tab) {
      console.log(tab.url);
      chrome.runtime.sendMessage({
         type: "NEVIGATE_URL",
         data: {
            tabNavigate: tab,
         },
      });
   });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
   if (changeInfo.pinned !== undefined) {
      chrome.runtime.sendMessage({
         type: "PIN_STATUS_CHANGED",
         data: {
            tab: tab,
            tabId: tabId,
            pinned: changeInfo.pinned,
         },
      });
   }
});

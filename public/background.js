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

const createPayload = (indexDrag, indexHover, windowIdDrag, windowIdHover) => {
   return {
      tabDrag: {
         index: indexDrag,
         windowId: windowIdDrag,
      },

      tabHover: {
         index: indexHover,
         windowId: windowIdHover,
      },
   };
};

// Lắng nghe sự kiện khi tab được di chuyển trong cùng một cửa sổ
chrome.tabs.onMoved.addListener((tabId, moveInfo) => {
   console.log("moveInfo : ", moveInfo);
   console.log("Thông tin di chuyển:", moveInfo);
   const payload = createPayload(
      moveInfo.fromIndex,
      moveInfo.toIndex,
      moveInfo.windowId,
      moveInfo.windowId
   );

   chrome.runtime.sendMessage({
      type: "MOVE_TAB_AROUND_WINDOW_CHROME",
      data: {
         ...payload,
      },
   });
});

// Lắng nghe khi tab được di chuyển từ cửa sổ này sang cửa sổ khác
chrome.tabs.onDetached.addListener((tabId, detachInfo) => {
   console.log("detachInfor : ", detachInfo);
   console.log("detach : ", tabId);

   chrome.tabs.onAttached.addListener((tabId, attachInfo) => {
      console.log("attach : ", tabId);
      console.log("attachInfor : ", attachInfo);
      const payload = createPayload(
         detachInfo.oldPosition,
         attachInfo.newPosition,
         detachInfo.oldWindowId,
         attachInfo.newWindowId
      );

      chrome.runtime.sendMessage({
         type: "MOVE_TAB_WITHOUT_WINDOW_CHROME",
         data: {
            ...payload,
         },
      });
   });
});

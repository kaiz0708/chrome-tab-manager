/** @format */
chrome.windows.onFocusChanged.addListener((windowId) => {
   // Đóng popup nếu có một cửa sổ mới được kích hoạt
   if (windowId === chrome.windows.WINDOW_ID_NONE) {
      return; // Không làm gì khi không có cửa sổ
   }

   chrome.action.getPopup({}, (popupUrl) => {
      if (popupUrl) {
         chrome.action.setPopup({ popup: "" }); // Xóa popup hiện tại
      }
   });
});

// Lắng nghe sự kiện khi tab thay đổi
chrome.tabs.onActivated.addListener((activeInfo) => {
   chrome.action.getPopup({}, (popupUrl) => {
      if (popupUrl) {
         chrome.action.setPopup({ popup: "" }); // Xóa popup hiện tại
      }
   });
});

/** @format */
import { createSlice } from "@reduxjs/toolkit";

const solveDelele = (window, tabId) => {
   for (let i = 0; i < window.length; i++) {
      if (window[i].tabs.length === 1 && tabId === window[i].tabs[0].id) {
         return window.filter((e) => e.id !== window[i].id);
      } else {
         const index = window[i].tabs.findIndex((item) => item.id === tabId);
         if (index !== -1 && window[i].tabs[index].active) {
            let index_last = window[i].tabs.length - 1;
            if (index == 0) {
               window[i].tabs[index_last].active = true;
            } else {
               index < index_last ? (window[i].tabs[index + 1].active = true) : (window[i].tabs[index - 1].active = true);
            }
         }
         window[i].tabs = window[i].tabs.filter((e) => e.id !== tabId);
      }
   }
   return window;
};

const windowSlice = createSlice({
   name: "window",
   initialState: {
      value: [],
      collection: [],
   },
   reducers: {
      setValue: (state, action) => {
         state.value = action.payload;
      },
      deleteWindow: (state, action) => {
         state.value = state.value.filter((e) => e.id !== action.payload);
      },
      addWindow: (state, action) => {
         state.value.push(action.payload);
      },
      deleteTab: (state, action) => {
         state.value = solveDelele(state.value, action.payload);
      },
      moveTabAroundWindow: (state, action) => {
         const { fromIndex, toIndex, windowId } = action.payload;
         state.value.forEach((window) => {
            if (window.id === windowId) {
               const [element] = window.tabs.splice(fromIndex, 1);
               window.tabs.splice(toIndex, 0, element);
            }
         });
      },
      pinTab: (state, action) => {
         const { tab, pinned, tabId } = action.payload;
         state.value.forEach((window) => {
            if (window.id === tab.windowId) {
               return window.tabs.map((e) => {
                  if (e.id === tab.id) {
                     pinned ? (e.pinned = true) : (e.pinned = false);
                  }
                  return e;
               });
            }
         });
      },
      navigateTab: (state, action) => {
         const { tabNavigate } = action.payload;
         state.value = state.value.map((window) => {
            if (window.id === tabNavigate.windowId) {
               window.tabs = window.tabs.map((tab) => {
                  if (tab.id === tabNavigate.id) {
                     return tabNavigate;
                  }
                  return tab;
               });
            }
            return window;
         });
      },
      moveTabWithoutWindow: (state, action) => {
         const { tabId, newPosition, newWindowId } = action.payload;
         var tabDrag = null;
         state.value.forEach((window) => {
            window.tabs.forEach((tab) => {
               if (tab.id === tabId) {
                  tabDrag = tab;
                  state.value = solveDelele(state.value, tabId);
                  tabDrag.active = false;
                  tabDrag.windowId = newWindowId;
               }
            });
         });

         state.value.forEach((window) => {
            if (window.id === newWindowId) {
               if (newPosition !== -1) {
                  window.tabs.splice(newPosition, 0, tabDrag);
               } else {
                  window.tabs.push(tabDrag);
               }
            }
         });
      },
      activeTab: (state, action) => {
         const { tabId, windowId } = action.payload;
         state.value.forEach((window) => {
            if (window.id === windowId) {
               window.tabs.forEach((tab) => (tab.id === tabId ? (tab.active = true) : (tab.active = false)));
            }
         });
      },
      addEmptyTab: (state, action) => {
         state.value = state.value.map((window) => {
            if (window.id !== action.payload.windowId) {
               return window;
            }
            window.tabs.push({
               ...action.payload.newTab,
               active: false,
            });
            return {
               ...window,
               tabs: window.tabs,
            };
         });
      },

      setValueCollection: (state, action) => {
         state.collection = action.payload;
      },

      deleteCollectionItem: (state, action) => {
         const { idCollection, tab } = action.payload;
         state.collection.forEach((collection) => {
            if (collection.id === idCollection) {
               collection.tabs = collection.tabs.filter((e) => e.id !== tab.id);
            }
         });
      },

      updateCollection: (state, action) => {
         const { data } = action.payload;
         state.collection = state.collection.map((collection) => (collection.id === data.id ? { ...collection, ...data } : collection));
      },

      addCollectionItem: (state, action) => {
         const { id, newPosition, tab } = action.payload;
         state.collection.forEach((collection) => {
            if (id === collection.id) {
               if (newPosition !== -1) {
                  collection.tabs.splice(newPosition, 0, tab);
               } else {
                  collection.tabs.push(tab);
               }
            }
         });
      },

      createCollection: (state, action) => {
         const { collection } = action.payload;
         console.log(collection);
         state.collection.push(collection);
      },

      deleteCollection: (state, action) => {
         const { collection } = action.payload;
         state.collection = state.collection.filter((e) => e.id !== collection.id);
      },
   },
});
export const {
   deleteWindow,
   deleteCollection,
   updateCollection,
   deleteCollectionItem,
   createCollection,
   setValueCollection,
   addCollectionItem,
   setValue,
   deleteTab,
   addEmptyTab,
   addWindow,
   moveTabAroundWindow,
   moveTabWithoutWindow,
   activeTab,
   navigateTab,
   pinTab,
} = windowSlice.actions;

export default windowSlice.reducer;

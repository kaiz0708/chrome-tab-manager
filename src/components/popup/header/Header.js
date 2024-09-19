/** @format */
/* global chrome */

function Header() {
   const moveMainPageExtension = () => {
      const url = chrome.runtime.getURL("main-page.html");
      window.open(url);
   };

   return (
      <div>
         <h1 className='text-2xl p-2 font-normal text-custom-color-title text-center'>
            Chrome Tab Manager
         </h1>

         <button
            onClick={(e) => {
               moveMainPageExtension();
            }}>
            Go to Another Page
         </button>
      </div>
   );
}

export default Header;

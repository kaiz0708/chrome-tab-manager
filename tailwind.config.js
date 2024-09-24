/**
 * @format
 * @type {import('tailwindcss').Config}
 */

module.exports = {
   content: ["./src/**/*.{js,jsx,ts,tsx}"],
   theme: {
      extend: {
         fontFamily: {
            sans: [
               "Open Sans",
               "Roboto",
               "Arial",
               "Helvetica Neue",
               "sans-serif",
            ],
            serif: ["Merriweather", "Georgia", "serif"],
         },
         colors: {
            "custom-black": "#1E1E26", // Thêm màu tùy chỉnh
            "custom-red": "#B91C1C", // Thêm màu tùy chỉnh
            "custom-green": "#16A34A", // Thêm màu tùy chỉnh
            "custom-pink": "#F65077",
            "custom-hover-gray": "rgb(225, 225, 231)",
            "custom-color-tooltip": "rgb(255, 240, 241)",
            "custom-color-title": "rgb(246, 80, 119)",
            "custom-title": "#70708C",
         },
         boxShadow: {
            custom: "1px 2px 4px rgba(112, 112, 140, 0.15)",
            "custom-hover": "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
         },
         filter: {
            "custom-drop-shadow":
               "drop-shadow(1px 2px 4px rgba(112, 112, 140, 0.15))", // Thêm filter drop-shadow tùy chỉnh
         },
         borderColor: {
            custom: "rgb(240, 240, 247);",
            "custom-hover": "rgb(183, 183, 206)",
         },
         borderRadius: {
            scrollbar: "5px", // Bo tròn cho scrollbar
         },
         borderWidth: {
            1: "1px",
         },
         width: {
            custom: "189px",
         },
         height: {
            custom: "470px",
            customBlock: "81.325px",
         },
         keyframes: {
            hoverEffect: {
               "0%": {
                  backgroundColor: "rgb(255, 255, 255)",
               },
               "100%": {
                  backgroundColor: "rgb(255, 240, 241)",
               },
            },
            hoverEffectBlock: {
               "0%": {
                  backgroundColor: "rgb(255, 255, 255)",
                  padding: "0.25rem",
               },
               "100%": {
                  backgroundColor: "rgb(255, 240, 241)",
                  padding: "0.25rem",
               },
            },
         },
         animation: {
            hoverEffect: "hoverEffect 0.1s ease-in-out forwards",
            hoverEffectBlock: "hoverEffectBlock 0.1s ease-in-out forwards",
         },
      },
   },
   plugins: [
      require("tailwindcss-filters"),
      function ({ addUtilities }) {
         addUtilities({
            ".scrollbar-thin": {
               "scrollbar-width": "thin" /* Firefox */,
            },
            ".scrollbar-thumb-rounded": {
               "&::-webkit-scrollbar": {
                  width: "8px" /* Độ rộng của thanh cuộn */,
                  height: "8px" /* Độ cao cho thanh cuộn ngang */,
               },
               "&::-webkit-scrollbar-thumb": {
                  "background-color":
                     "rgba(156, 163, 175, 0.3)" /* Màu của thanh kéo */,
                  "border-radius": "8px" /* Bo tròn thanh kéo */,
               },
               "&::-webkit-scrollbar-track": {
                  background:
                     "rgba(229, 231, 235, 0.3)" /* Màu nền của track */,
               },
            },
         });
      },
   ],
   variants: {
      extend: {
         backgroundColor: ["hover"], // Đảm bảo variant hover được hỗ trợ
      },
   },
};

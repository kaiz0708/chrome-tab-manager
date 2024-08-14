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
         },
         boxShadow: {
            custom: "1px 2px 4px rgba(112, 112, 140, 0.15)", // Thêm giá trị box-shadow tùy chỉnh
         },
         filter: {
            "custom-drop-shadow":
               "drop-shadow(1px 2px 4px rgba(112, 112, 140, 0.15))", // Thêm filter drop-shadow tùy chỉnh
         },
         borderColor: {
            custom: "rgb(240, 240, 247);",
            "custom-hover": "rgb(183, 183, 206)",
         },
         borderWidth: {
            1: "1px",
         },
      },
   },
   plugins: [require("tailwindcss-filters")],
   variants: {
      extend: {
         backgroundColor: ["hover"], // Đảm bảo variant hover được hỗ trợ
      },
   },
};

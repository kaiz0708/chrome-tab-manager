/** @format */
const path = require("path");
const Dotenv = require("dotenv-webpack");

module.exports = {
   entry: "./src/main-page.js", // Đầu vào tệp React
   output: {
      path: path.resolve(__dirname, "public"), // Đầu ra thư mục
      filename: "main-page.bundle.js", // Tên tệp biên dịch
   },
   module: {
      rules: [
         {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
               loader: "babel-loader",
               options: {
                  presets: ["@babel/preset-env", "@babel/preset-react"],
               },
            },
         },
         {
            test: /\.css$/,
            use: [
               "style-loader", // Nhúng CSS vào DOM
               "css-loader", // Xử lý các import CSS
               "postcss-loader", // Chạy CSS qua PostCSS (bao gồm Tailwind CSS)
            ],
         },
      ],
   },
   plugins: [
      new Dotenv(), // Thêm plugin để đọc biến môi trường từ .env
   ],
   mode: "production",
   resolve: {
      extensions: [".js", ".jsx"],
   },
};

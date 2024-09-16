/** @format */
const path = require("path");
const Dotenv = require("dotenv-webpack");
const autoprefixer = require("autoprefixer");
const plugin = autoprefixer({ grid: true });

module.exports = {
   entry: {
      mainPage: "./src/main-page.js",
   },
   output: {
      path: path.resolve(__dirname, "public"), // Đầu ra thư mục
      filename: "[name].bundle.js", // Tên tệp biên dịch
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
               "style-loader",
               "css-loader",
               {
                  loader: "postcss-loader",
                  options: {
                     postcssOptions: {
                        plugins: [
                           require("tailwindcss"),
                           require("autoprefixer")({ grid: true }),
                        ],
                     },
                  },
               },
            ],
         },
         {
            test: /\.m?js$/,
            resolve: {
               fullySpecified: false, // disable the behaviour
            },
         },
      ],
   },
   plugins: [new Dotenv()],
   mode: "production",
   resolve: {
      extensions: [".js", ".jsx"],
   },
};

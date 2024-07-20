const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  mode: "development",
  entry: "./script.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "chatbot.bundle.js",
    library: "Chatbot",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", "@babel/preset-env"],
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    fallback: {
      crypto: require.resolve("crypto-browserify"),
    },
    extensions: [".js", ".jsx", ".json"],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NEXT_PUBLIC_API_PROFILE": JSON.stringify(process.env.NEXT_PUBLIC_API_PROFILE),
      "process.env.NEXT_PUBLIC_HEADER_ACCESS": JSON.stringify(process.env.NEXT_PUBLIC_HEADER_ACCESS),
      "process.env.NEXT_PUBLIC_SECRET_KEY": JSON.stringify(process.env.NEXT_PUBLIC_SECRET_KEY),
    }),
  ],
};

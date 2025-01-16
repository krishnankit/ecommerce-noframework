const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const dotenv = require("dotenv");
const path = require("node:path");

dotenv.config();

module.exports = {
  entry: "./index.js",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "index_bundle.js",
    publicPath: "/",
  },
  target: "web",
  devServer: {
    // This will serve index.html for all 404
    // Needed for react-router
    historyApiFallback: true,
    port: "3000",
    static: {
      directory: path.join(__dirname, "public")
    },
    // Do not open browser after server is started/restarted
    open: false,
    hot: true,
    liveReload: true,
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],
  },
  // show minimal server logs in terminal
  stats: "minimal",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      // For tailwind css
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        exclude: /node_modules/,
        use: ["file-loader"]
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "index.html")
    }),
    // fix "process is not defined" error:
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
  ],
}

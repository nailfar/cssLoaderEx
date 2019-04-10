"use strict";
const utils = require("./utils");
const webpack = require("webpack");
const config = require("../config");
const merge = require("webpack-merge");
const path = require("path");
const baseWebpackConfig = require("./webpack.base.conf");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const portfinder = require("portfinder");
const serverConf = require("./dev-server-conf");

const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");

function resolve(dir) {
  return path.join(__dirname, "..", dir);
}


// const re = utils.styleLoaders({
//   sourceMap: config.dev.cssSourceMap,
//   usePostCSS: false,
// })

// process.exit();

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: "development",
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: serverConf,
  plugins: [
    new HardSourceWebpackPlugin(),

    new HardSourceWebpackPlugin.ExcludeModulePlugin([
      {
        test: /mini-css-extract-plugin[\\/]dist[\\/]loader/,
      },
    ]),
    new ForkTsCheckerWebpackPlugin(),

    new webpack.DefinePlugin({
      "process.env": require("../config/dev.env"),
    }),
    new webpack.HotModuleReplacementPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: resolve("static/index.html"),
      inject: true,
      chunksSortMode: "none",
    }),
  ],
});

exports.config = devWebpackConfig;

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port;
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err);
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port;
      // add port to devServer config
      devWebpackConfig.devServer.port = port;

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`, "End"],
          },
          onErrors: config.dev.notifyOnErrors ? utils.createNotifierCallback() : undefined,
        }),
      );
      resolve(devWebpackConfig);
    }
  });
});

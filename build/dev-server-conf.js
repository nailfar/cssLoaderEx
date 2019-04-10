const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);
const config = require("../config");


module.exports = {
  clientLogLevel: "warning",
  hot: true,
  contentBase: false, // since we use CopyWebpackPlugin.
  compress: true,
  host: HOST || config.dev.host,
  port: PORT || config.dev.port,
  open: config.dev.autoOpenBrowser,
  overlay: config.dev.errorOverlay ? { warnings: false, errors: true } : false,
  publicPath: config.dev.assetsPublicPath,
  quiet: true, // necessary for FriendlyErrorsPlugin
  watchOptions: {
    poll: config.dev.poll,
  },
};

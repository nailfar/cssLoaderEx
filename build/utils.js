"use strict";
const path = require("path");
const config = require("../config");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const packageConfig = require("../package.json");
const isProd = process.env.NODE_ENV === "production";
exports.assetsPath = function(_path) {
  const assetsSubDirectory = isProd ? config.build.assetsSubDirectory : config.dev.assetsSubDirectory;

  return path.posix.join(assetsSubDirectory, _path);
};
/**
 * use css module
 */
exports.cssLoaders = function(options, isModule = false) {
  options = options || {};

  const cssmoduleConf = { modules: true, importLoaders: 3, localIdentName: "[local]_[hash:base64:5]" };

  const cssLoader = {
    loader: "css-loader",
    options: {
      sourceMap: options.sourceMap,
      ...(isModule ? cssmoduleConf : {}),
    },
  };

  const postcssLoader = {
    loader: "postcss-loader",
    options: {
      sourceMap: options.sourceMap,
    },
  };

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    const loaders = [];

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      loaders.push(MiniCssExtractPlugin.loader);
    } else {
      loaders.push("vue-style-loader");
    }

    loaders.push(cssLoader);
    if(isModule){
      loaders.push("resolve-url-loader")
    }

    if (options.usePostCSS) {
      loaders.push(postcssLoader);
    }

    if (loader) {
      loaders.push({
        loader: loader + "-loader",
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap,
        }),
      });
    }

    return loaders;
  }

  return generateLoaders;
};

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function(options) {
  const output = [];

  const sassLoaderConf = [
    "fast-sass",
    {
      // data: `@import "~@/assets/styles/variables.scss";`,
      data: `@import "${path.resolve(__dirname, "../", "src/assets/styles/variables.scss")}";`,
    },
  ];
  const loaders = {
    css: {
      default: exports.cssLoaders(options)(),
    },
    scss: {
      default: exports.cssLoaders(options)(...sassLoaderConf),
      module: exports.cssLoaders(options, true)(...sassLoaderConf),
    },
  };

  for (const extension in loaders) {
    const loader = loaders[extension];
    output.push({
      test: new RegExp("\\." + extension + "$"),
      oneOf: [
        loader.module && {
          test: /\.module\.\w+$/,
          use: loader.module,
        },
        {
          use: loader.default,
        },
      ].filter(Boolean),
    });
  }
  return output;
};
exports.createNotifierCallback = () => {
  const notifier = require("node-notifier");

  return (severity, errors) => {
    if (severity !== "error") return;

    const error = errors[0];
    const filename = error.file && error.file.split("!").pop();

    notifier.notify({
      title: packageConfig.name,
      message: severity + ": " + error.name,
      subtitle: filename || "",
      icon: path.join(__dirname, "logo.png"),
    });
  };
};

exports.resolve = function(dir) {
  return path.join(__dirname, "..", dir);
};

/**
 * 生成dll插入脚本
 */
exports.renderScript = function(conf) {
  if (!conf || typeof conf !== "object") {
    return "";
  }
  const re = Object.keys(conf).map((key) => {
    return `<script type="text/javascript"   src="./static/${conf[key].js}" ></script>`;
  });
  return re.join("\n\r");
};

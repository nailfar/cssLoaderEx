"use strict";
const path = require("path");
const utils = require("./utils");
const config = require("../config");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

const includeJsModules = [resolve("src"), resolve("node_modules/webpack-dev-server/client")];

const checkTsType = process.env.npm_config_check;

const cacheLoader = {
  loader: "cache-loader",
  options: {
    cacheDirectory: resolve("node_modules/.cache/.cache-loader"),
  },
};

const HappyPack = require("happypack");
const os = require("os");
const happyThreadPool = HappyPack.ThreadPool({
  size: 1,
});

const happyBabel = happyPackCreator({
  id: "happyBabel",
  loaders: [
    {
      loader: "babel-loader",
      options: {
        cacheDirectory: true,
      },
    },
  ],
});

const happyTs = happyPackCreator({
  id: "happyTs",
  loaders: [
    cacheLoader,
    {
      loader: "ts-loader",
      options: {
        happyPackMode: true,
        transpileOnly: !checkTsType,
        compilerOptions: {
          noEmit: false,
        },
      },
    },
  ],
});

module.exports = {
  context: path.resolve(__dirname, "../"),
  entry: {
    app: "./src/main.ts",
  },
  output: {
    path: config.build.assetsRoot,
    filename: "[name].js",
    publicPath: process.env.NODE_ENV === "production" ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
  },
  resolve: {
    modules: [path.resolve(__dirname, "../node_modules")],
    extensions: [".js", ".vue", ".ts", ".tsx", ".json"],
    alias: {
      "@": resolve("src"),
    },
  },
  externals: {},
  plugins: [new VueLoaderPlugin(), happyBabel, happyTs].filter(Boolean),
  module: {
    unknownContextCritical: false,
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.css$/,
        oneOf: [{ use: ["vue-style-loader", { loader: "css-loader", options: { sourceMap: true } }] }],
      },
      {
        test: /\.scss$/,
        oneOf: [
          
          {
            test: /\.module\.\w+$/,
            use: [
              "vue-style-loader",
              {
                loader: "css-loader",
                options: {
                  // sourceMap: true,
                  modules: true,
                  // exportOnlyLocals:true,
                  importLoaders: 1,
                  localIdentName: "[local]_[hash:base64:5]",
                },
              },
              {
                loader: "sass-loader",
                options: {
                  // data: `@import "${path.resolve(__dirname, "../", "src/assets/styles/variables.scss")}";`,
                  sourceMap: true,
                },
              },
            ],
          },
          {
            use: [
              "vue-style-loader",
              {
                loader: "css-loader",
                options: {
                  sourceMap: true,
                },
              },
              {
                loader: "fast-sass-loader",
                options: {
                  data: `@import "${path.resolve(__dirname, "../", "src/assets/styles/variables.scss")}";`,
                  sourceMap: true,
                },
              },
            ],
          },
        ],
      },
      {
        test: /\.vue$/,
        include: [resolve("src")],
        exclude: /node_modules/,
        use: [
          {
            loader: "vue-loader",
          },
        ],
      },
      {
        test: /\.js$/,
        loader: [happyBabel.hp_loader],
        include: includeJsModules,
      },
      {
        test: /\.ts?$/,
        loader: happyTs.hp_loader,
        exclude: /node_modules/,
      },
      {
        test: /\.tsx$/,
        exclude: /node_modules/,
        loader: [happyBabel.hp_loader, happyTs.hp_loader].filter(Boolean),
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 1024 * 100,
              name: utils.assetsPath("img/[name].[hash:7].[ext]"),
            },
          },
        ],
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              name: utils.assetsPath("media/[name].[hash:7].[ext]"),
            },
          },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              name: utils.assetsPath("fonts/[name].[hash:7].[ext]"),
            },
          },
        ],
      },
    ],
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: "empty",
    fs: "empty",
    net: "empty",
    tls: "empty",
    child_process: "empty",
  },
};

function resolve(dir) {
  return path.join(__dirname, "..", dir);
}

function createLintingRule() {
  return {
    test: /\.(js|vue)$/,
    loader: "eslint-loader",
    enforce: "pre",
    include: [resolve("src"), resolve("test")],
    options: {
      formatter: require("eslint-friendly-formatter"),
      emitWarning: !config.dev.showEslintErrorsInOverlay,
    },
  };
}

function happyPackCreator(options = {}) {
  const re = new HappyPack({
    ...{
      threadPool: happyThreadPool,
      threads: 3,
      verbose: true,
      verboseWhenProfiling: true,
      debug: false,
    },
    ...options,
  });
  re.hp_loader = `happypack/loader?id=${options.id}`;
  return re;
}

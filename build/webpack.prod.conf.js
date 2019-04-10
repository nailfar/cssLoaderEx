"use strict";
const path = require("path");
const utils = require("./utils");
const webpack = require("webpack");
const config = require("../config");
const merge = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.conf");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCSSPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const ParallelUglifyPlugin = require("webpack-parallel-uglify-plugin");
const env = process.env.NODE_ENV === "testing" ? require("../config/test.env") : require("../config/prod.env");
function resolve(dir) {
  return path.join(__dirname, "..", dir);
}
const webpackConfig = merge(baseWebpackConfig, {
  mode: "production",
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: false,
    }),
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath("js/[name]$[chunkhash:8].js"),
    chunkFilename: utils.assetsPath("js/[name]$[chunkhash:8].js"),
  },
  optimization: {
    runtimeChunk: "single", //
    splitChunks: {
      chunks: "all",
      automaticNameDelimiter: "@",
      minSize: 300 * 1024,
      maxSize: 800 * 1024,
      cacheGroups: {
        // libs: {
        //   name: "chunk-libs",
        //   chunks: "initial", // 只打包初始时依赖的第三方
        //   maxSize: 600 * 1024,
        //   maxInitialRequests: 3,
        //   reuseExistingChunk: true,
        //   enforce: true,
        // },
        commons: {
          name: "chunk-comomns",
          maxInitialRequests: 5,
          minChunks: 3, // 最小共用次数
          minSize: 300 * 1024,
          priority: 5,
          reuseExistingChunk: true,
          maxSize: 600 * 1024,
        },
        // styles: {
        //   name: "styles",
        //   test: /\.(scss|css)$/,
        //   chunks: "async",
        //   minChunks: 1,
        //   minSize: 300 * 1024,
        //   maxSize: 600 * 1024,
        //   reuseExistingChunk: true,
        //   enforce: true,
        // },
      },
    },
    minimizer: [
      // new ParallelUglifyPlugin({
      //   cacheDir: "node_modules/.cache/uglify",
      //   uglifyES: {
      //     output: {
      //       comments: false,
      //     },
      //     compress: {
      //       warnings: false,
      //     },
      //   },
      //   sourceMap: config.build.productionSourceMap,
      // }),
      new OptimizeCSSPlugin({
        // https://github.com/ben-eb/cssnano/issues/247
        cssProcessor: require("cssnano")({
          reduceIdents: false,
        }),
      }),
    ],
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      "process.env": env,
    }),
    /**
     * https://github.com/webpack-contrib/mini-css-extract-plugin/issues/250
     *
     */
    new MiniCssExtractPlugin({
      // 类似 webpackOptions.output里面的配置 可以忽略
      filename: utils.assetsPath("css/[name]$[hash:8].css"),
      chunkFilename: utils.assetsPath("css/[name]$[hash:8].css"),
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap ? { safe: true, map: { inline: false } } : { safe: true },
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: process.env.NODE_ENV === "testing" ? "index.html" : config.build.index,
      template: resolve("static/index.html"),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        // removeAttributeQuotes: true,
        // minifyCSS: true,
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: "manual",
    }),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
  ],
});

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require("compression-webpack-plugin");

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: new RegExp("\\.(" + config.build.productionGzipExtensions.join("|") + ")$"),
      threshold: 10240,
      minRatio: 0.8,
    }),
  );
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}
/**
 * 查看打包时间分析：
 */
/* const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin({});
module.exports = smp.wrap(webpackConfig);
 */
module.exports = webpackConfig;

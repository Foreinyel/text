"use strict";

const path = require("path");
const { parseResourceName } = require("@hemyn/utils-node");
const pkg = require("./package.json");

module.exports = function (mode) {
  const prod = mode === "production";
  return {
    entry: "./src/index.ts",
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".json", ".less"],
      mainFields: ["main"],
    },
    output: {
      path: path.join(__dirname, "/public"),
      filename: prod
        ? `${parseResourceName(pkg.name)}.js`
        : `${parseResourceName(pkg.name)}.dev.js`,
      libraryTarget: "system",
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "babel-loader",
          exclude: /node_modules/,
        },

        // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
        { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },

        {
          test: /\.less$/i,
          exclude: /node_modules/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: true,
              },
            },
            "postcss-loader",
            {
              loader: "less-loader",
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                  math: "always",
                },
              },
            },
          ],
        },
      ],
    },
    mode,
    plugins: [],
    devtool: prod ? false : "source-map",
    externals: {
      react: "React",
    },
  };
};

"use strict";

const webpack = require("webpack");
const path = require("path");

const pkg = require("./package.json");
const { parseResourceName } = require("@hemyn/utils-node");
const config = require("./webpack.config");

const build = function (mode) {
  return new Promise(function (resolve, reject) {
    const compiler = webpack(config(mode));

    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
const buildDemo = function () {
  return new Promise(function (resolve, reject) {
    const mode = "production";
    const compiler = webpack({
      entry: "./src/Example.tsx",
      resolve: {
        extensions: [".ts", ".tsx", ".js", ".json", ".less"],
        mainFields: ["main"],
      },
      output: {
        path: path.join(__dirname, "/public"),
        filename: `${parseResourceName(pkg.name)}.demo.js`,
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
      devtool: false,
      externals: {
        react: "React",
      },
    });

    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

(async () => {
  await Promise.all([
    ...["production", "development"].map((mode) => build(mode)),
    buildDemo(),
  ]);
})();

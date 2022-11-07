"use strict";

const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const config = require("./webpack.config");

const compiler = webpack(config("production"));

if (compiler) {
  const devServerOptions = Object.assign(
    {},
    {
      // 热更新，无需刷新
      hot: true,
      port: 9000,
      static: "../public",
      historyApiFallback: true,
      proxy: {
        // "/api": {
        //   target: "http://localhost:7004",
        //   pathRewrite: { "^/api": "" },
        // },
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers":
          "X-Requested-With, content-type, Authorization",
      },
    }
  );

  const server = new WebpackDevServer(compiler, devServerOptions);
  const port = devServerOptions.port || 7005;
  server.listen(port, "127.0.0.1", () => {
    // console.log(chalk.red(`Starting server on http://localhost:${port}`));
  });
}

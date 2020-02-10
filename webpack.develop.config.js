const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin");
const InlineManifestWebpackPlugin = require("inline-manifest-webpack-plugin");
const defaultPlugins = require("./webpack.plugins");
const defaultConfig = require("./webpack.config");

const ENV = process.env.NODE_ENV || "development";
console.log("Running in " + ENV + " mode!!");

defaultConfig.entry = {
  Scratch: [
    "webpack-dev-server/client?http://0.0.0.0:8000",
    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint

    "webpack/hot/only-dev-server",
    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates
    "@babel/polyfill",
    "./index.js"
  ]
};

const plugins = defaultPlugins.concat([
  new webpack.NamedModulesPlugin(),
  new HtmlWebpackPlugin({
    //see: https://github.com/jaketrent/html-webpack-template
    title: "Scratch UI Javascript Framework",
    //template: require('html-webpack-template'),
    inject: false,
    template: "index.ejs",
    alwaysWriteToDisk: true,
    // Optional
    /*appMountId: 'app',
        baseHref: 'http://example.com/awesome',
        devServer: 'http://localhost:3001',
        googleAnalytics: {
            trackingId: 'UA-XXXX-XX',
            pageViewOnLoad: true
        },*/
    meta: [
      {
        name: "description",
        content: "A better default template for html-webpack-plugin."
      }
    ],
    mobile: true,
    links: [
      "http://fonts.googleapis.com/css?family=Merriweather:300,400,700,900%7COpen+Sans:300,300italic,400,400italic,600,600italic,700,700italic,800,800italic%7CDroid+Sans:400,700",
      {
        href: "https://daks2k3a4ib2z.cloudfront.net/img/webclip.png",
        rel: "apple-touch-icon",
        sizes: "180x180"
      },
      {
        href: "https://daks2k3a4ib2z.cloudfront.net/img/favicon.ico",
        rel: "icon",
        sizes: "32x32",
        type: "image/png"
      }
    ],
    inlineManifestWebpackName: "webpackManifest",
    scripts: [
      "https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js",
      "https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"
    ],
    window: {
      Scratch: {
        config: {
          fixtures: {
            quantities: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
          }
        }
      }
    }
  }),
  new HtmlWebpackHarddiskPlugin(),
  new InlineManifestWebpackPlugin()
]);

module.exports = Object.assign({}, defaultConfig, {
  devtool: "eval-source-map",
  plugins: plugins,
  externals: [{ sinon: true }],
  devServer: {
    port: process.env.PORT || 8000,
    host: "0.0.0.0",
    hot: true,
    //publicPath: "/js",
    publicPath: "/",
    contentBase: "./src",
    historyApiFallback: true
    /*proxy: [{
            // OPTIONAL: proxy configuration:
            path: '/optional-prefix/**',
            target: 'http://target-host.com',
            rewrite: req => { req.url = req.url.replace(/^\/[^\/]+\//, ''); }   // strip first path segment
        }]*/
  }
});

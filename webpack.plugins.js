const webpack = require("webpack");
const WebpackAutoInject = require("webpack-auto-inject-version");
const autoprefixer = require("autoprefixer");

module.exports = [
  new webpack.NoEmitOnErrorsPlugin(),
  new WebpackAutoInject({
    autoIncrease: false,
    injectByTagFileRegex: /(.){1,}.js$/,
    injectAsComment: false
  }),
  new webpack.LoaderOptionsPlugin({
    options: {
      postcss: [
        autoprefixer({
          browsers: ["last 2 versions", "> 1%"]
        }),
        require("precss")
      ]
    }
  })
];

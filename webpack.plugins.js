const webpack = require('webpack');
const WebpackAutoInject = require('webpack-auto-inject-version');

module.exports = [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    //new webpack.ProvidePlugin({}),
    new WebpackAutoInject({
        autoIncrease: false,
        injectByTagFileRegex: /(.){1,}.js$/,
        injectAsComment: false
    })
];

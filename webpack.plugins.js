const webpack = require('webpack');

module.exports = [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    //new webpack.ProvidePlugin({}),
];

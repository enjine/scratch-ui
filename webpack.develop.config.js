const webpack = require('webpack');
const defaultPlugins = require('./webpack.plugins');
const defaultConfig = require('./webpack.config');

const ENV = process.env.NODE_ENV || 'development';
console.log('Running in ' + ENV + ' mode!!');

const plugins = defaultPlugins.concat([
    new webpack.NamedModulesPlugin()
]);

defaultConfig.entry = {
    'E750': [
        'webpack-dev-server/client?http://0.0.0.0:8000',
        // bundle the client for webpack-dev-server
        // and connect to the provided endpoint

        'webpack/hot/only-dev-server',
        // bundle the client for hot reloading
        // only- means to only hot reload for successful updates
        'babel-polyfill',
        './index.js'
        ],
    'E750.browser': [
        'webpack-dev-server/client?http://0.0.0.0:8000',
        'webpack/hot/only-dev-server',
        'babel-polyfill',
        './browser.js'
    ]};

module.exports = Object.assign({}, defaultConfig, {
    devtool: 'eval-source-map',
    plugins: plugins,
    externals: [
        {'sinon': true}
    ],
    devServer: {
        port: process.env.PORT || 8000,
        host: '0.0.0.0',
        hot: true,
        publicPath: '/js/',
        contentBase: './src',
        historyApiFallback: true,
        /*proxy: [{
            // OPTIONAL: proxy configuration:
            path: '/optional-prefix/**',
            target: 'http://target-host.com',
            rewrite: req => { req.url = req.url.replace(/^\/[^\/]+\//, ''); }   // strip first path segment
        }]*/
    }
});

const webpack = require('webpack');
const defaultPlugins = require('./webpack.plugins');
const defaultConfig = require('./webpack.config');

const ENV = process.env.NODE_ENV || 'development';
console.log('Running in ' + ENV + ' mode!!');

const plugins = defaultPlugins.concat([
    new webpack.HotModuleReplacementPlugin()
]);

defaultConfig.entry['E750.browser'].unshift('webpack/hot/dev-server');
defaultConfig.entry.E750.unshift('webpack/hot/dev-server');

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
        proxy: [
            // OPTIONAL: proxy configuration:
            // {
            // 	path: '/optional-prefix/**',
            // 	target: 'http://target-host.com',
            // 	rewrite: req => { req.url = req.url.replace(/^\/[^\/]+\//, ''); }   // strip first path segment
            // }
        ]
    }
});
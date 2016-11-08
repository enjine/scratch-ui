var defaultConfig = require('./webpack.config');
var defaultPlugins = require('./webpack.plugins');
var webpack = require('webpack');

const ENV = process.env.NODE_ENV || 'production';
console.log('Running in ' + ENV + ' mode!!');

const plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('production')
        }
    },
    new webpack.DefinePlugin({
        VERSION: JSON.stringify(require('./package.json').version)
    }))
].concat(defaultPlugins);

module.exports = Object.assign({}, defaultConfig, {
    devtool: 'hidden-source-map',
    plugins: plugins
});

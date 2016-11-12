const defaultConfig = require('./webpack.config');
const defaultPlugins = require('./webpack.plugins');
const webpack = require('webpack');
const createVariants = require('parallel-webpack').createVariants;

const ENV = process.env.NODE_ENV || 'production';
console.log('Running in ' + ENV + ' mode!!');


const variants = {
    minified: [true, false],
    target: ['umd', 'commonjs2']
};

const baseProps = {devtool: 'hidden-source-map'};

const prodPlugins = [
    new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
    new webpack.optimize.AggressiveMergingPlugin()
].concat(defaultPlugins);


function generateOutputTarget (options) {
    var plugins = [];
    if (options.minified) {
        plugins.push(new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            compress: {
                warnings: false
            }
        }));
    }

    return Object.assign({}, defaultConfig, {
        plugins: plugins.concat(prodPlugins),
        output: Object.assign({}, defaultConfig.output, {
            filename: '[name].' +
            options.target +
            (options.minified ? '.min' : '') +
            '.js',
            libraryTarget: options.target
        })
    });
}

module.exports = createVariants(baseProps, variants, generateOutputTarget);

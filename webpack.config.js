var path = require('path');
var webpack = require('webpack');

const ENV = process.env.NODE_ENV || 'development';

module.exports = {
    devtool: ENV === 'production' ? 'cheap-module-eval-source-map' : 'inline-source-map',
    context: path.resolve(__dirname, 'src/client'),
    entry: [
        './main.js'
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: 'e750.js'
        //filename: '[name].[hash].js',
        //chunkFilename: '[id].[hash].js'
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ],
    externals: [
        { 'sinon': true }
    ],
    resolve: {
        modulesDirectories: [
            'node_modules',
            'client/com.e750',
            'test'
        ],
        alias: {
            sinon: 'sinon/pkg/sinon.js'
        }
    },
    module: {
        preLoaders: [],
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel-loader'],
                include: [
                    path.resolve(__dirname, 'src/client'),
                    path.resolve(__dirname, 'test/client')
                ],
                exclude: /(node_modules|bower_components)/
            }
        ]
    },

    stats: { colors: true },

    devServer: {
        port: process.env.PORT || 8080,
        host: '0.0.0.0',
        colors: true,
        publicPath: '/',
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
};

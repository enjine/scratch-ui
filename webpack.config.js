const path = require('path');
const plugins = require('./webpack.plugins');

module.exports = {
    target: 'web',
    context: path.resolve(__dirname),
    entry: {
        'E750': ['babel-polyfill', './index.js'],
        'E750.browser': ['babel-polyfill', './browser.js']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].js',
        //filename: '[name].[hash].js',
        //chunkFilename: '[id].[hash].js',
        library: ['E750', 'App'],
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    plugins: plugins,
    resolve: {
        modules: [
            path.resolve(__dirname),
            'node_modules'
        ],
        alias: {
            sinon: 'sinon/pkg/sinon.js',
            lib: 'src/client/com.e750/lib',
            cart: 'src/client/com.e750/cart'
        },
        extensions: ['.js', '.jsx', '.scss']
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel-loader'],
                include: [
                    path.resolve(__dirname, 'src/client'),
                    path.resolve(__dirname, 'src/client/com.e750')
                ],
                exclude: /(node_modules|bower_components)/
            },
            {
                test: /\.scss$/,
                loaders: ['style-loader', 'css-loader?importLoaders=1', 'postcss-loader?sourceMap=inline', 'sass-loader']
            },
            {
                test: /\.woff$/,
                loader: 'url-loader?limit=10000&mimetype=application/font-woff&name=[path][name].[ext]'
            }, {
                test: /\.woff2$/,
                loader: 'url-loader?limit=10000&mimetype=application/font-woff2&name=[path][name].[ext]'
            }, {
                test: /\.(eot|ttf|svg|gif|png)$/,
                loader: 'file-loader'
            }
        ]
    },
    stats: {colors: true}
};

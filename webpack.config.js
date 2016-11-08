const path = require('path');
const plugins = require('./webpack.plugins');

module.exports = {
    target: 'web',
    context: path.resolve(__dirname),
    entry: [
        'babel-polyfill',
        './src/client/main.js',
        'webpack/hot/dev-server'
    ],
    output: {
        path: path.resolve(__dirname),
        publicPath: '/',
        filename: 'e750.js',
        //filename: '[name].[hash].js',
        //chunkFilename: '[id].[hash].js',
        library: 'E750',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    plugins: plugins,
    resolve: {
        root: path.resolve(__dirname),
        modulesDirectories: [
            'node_modules'
        ],
        alias: {
            sinon: 'sinon/pkg/sinon.js',
            lib: 'src/client/com.e750/lib',
            cart: 'src/client/com.e750/cart'
        },
        extensions: ['', '.js', '.jsx']
    },
    module: {
        preLoaders: [],
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
                loaders: ['style', 'css?importLoaders=1', 'postcss?sourceMap=inline', 'sass']
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
    postcss: (webpack) => {
        return [
            require('postcss-import')({ addDependencyTo: webpack }),
            require('postcss-cssnext')({
                browsers: ['last 2 versions', '> 1%']
            }),
            require('postcss-reporter')()
        ];
    },
    stats: {colors: true}
};

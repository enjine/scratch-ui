var path = require('path');
var webpack = require('webpack');

const ENV = process.env.NODE_ENV || 'development';

module.exports = {
    target: 'web',
    devtool: ENV === 'production' ? 'cheap-module-eval-source-map' : 'inline-source-map',
    context: path.resolve(__dirname, 'src/client'),
    entry: [
        'babel-polyfill',
        './main.js',
        'webpack/hot/dev-server'
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
        new webpack.ProvidePlugin({}),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    externals: [
        {'sinon': true}
    ],
    resolve: {
        root: path.resolve(__dirname),
        modulesDirectories: [
            'node_modules',
            'src',
            'test'
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
                    path.resolve(__dirname, 'test/modules'),
                    path.resolve(__dirname, 'test/behaviors'),
                    path.resolve(__dirname, 'test/unit'),
                    path.resolve(__dirname, 'test')
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
    stats: {colors: true},

    devServer: {
        port: process.env.PORT || 8000,
        host: '0.0.0.0',
        hot: true,
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

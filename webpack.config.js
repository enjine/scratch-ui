var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'cheap-module-source-map',
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
    resolve: {
        modulesDirectories: [
            'node_modules',
            'client/com.e750'
        ]
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                include: [
                    path.resolve(__dirname, 'src/client')
                ],
                exclude: /(node_modules|bower_components)/
            }
        ]
    }
};

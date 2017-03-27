// Karma configuration
const webpack = require('webpack');
const path = require('path');
const webpackConfig = require('./webpack.config.js');

webpackConfig.entry = [];
webpackConfig.module.loaders.unshift(
    {
        test: /\.js$/,
        use: 'babel-loader',
        include: [
            path.resolve(__dirname, 'test/modules'),
            path.resolve(__dirname, 'test/behaviors'),
            path.resolve(__dirname, 'test/unit'),
            path.resolve(__dirname, 'test')
        ],
        exclude: /(node_modules|bower_components)/
    }
);

webpackConfig.resolve.modules.push('test');
webpackConfig.plugins.push(new webpack.LoaderOptionsPlugin({
    options: {
        debug: true,
    }
}));

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'chai', 'sinon', 'better-sinon-chai'],

        client: {
            captureConsole: true,
            mocha: {
                reporter: 'html', // change Karma's debug.html to the mocha web reporter
                ui: 'bdd'
            },
            chai: {
                includeStack: true,
                showDiff: true,
                truncateThreshold: 0
            }
        },

        // list of files / patterns to load in the browser test runner
        files: [
            './test/polyfills/phantomjs.domparser.js',
            './test/fixtures.js',
            './test/index.js'
        ],

        // list of files to exclude
        exclude: [
            './test/behaviors/**/*.js',
            './test/server/**/*.js'
        ],

        // support writing tests in ES6-7
        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            './test/index.js': ['webpack']
        },

        webpack: {
            devtool: 'inline-source-map',
            module: webpackConfig.module,
            resolve: webpackConfig.resolve,
        },

        webpackMiddleware: {
            noInfo: true,
            stats: {
                colors: true
            }
        },

        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'mocha', 'notify', 'junit', 'coverage-istanbul'],

        coverageIstanbulReporter: {
            reports: ['html', 'text-summary'],
            dir: path.join(__dirname, 'reports', 'coverage'),
            'report-config': {
                html: {
                    // outputs the report in ./reports/coverage/html
                    subdir: 'html'
                },
                thresholds: {
                    statements: 80,
                    lines: 80,
                    branches: 80,
                    functions: 90
                },
                fixWebpackSourcePaths: true
            }
        },
        mochaReporter: {
            output: 'full' //full, autowatch, minimal
        },

        // unit tests JUNIT reporter for Bamboo
        junitReporter: {
            outputDir: './reports/junit',
            outputFile: 'test-results.xml',
            suite: ''
        },

        notifyReporter: {
            reportEachFailure: true, // Default: false, Will notify on every failed sepc
            reportSuccess: true // Default: true, Will notify when a suite was successful
        },


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        customLaunchers: {
            'ChromeES6': {
                base: 'Chrome',
                flags: ['--enable-javascript-harmony']
            },
            'ChromeCanaryES6': {
                base: 'ChromeCanary',
                flags: ['--enable-javascript-harmony']
            }
        },

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        //browsers: ['ChromeES6', 'ChromeCanaryES6', 'Firefox', 'Safari'],
        //browsers: ['Chrome', 'ChromeCanary', 'Firefox', 'Safari', 'PhantomJS'],
        //browsers: ['Chrome', 'PhantomJS', 'Firefox'], //'PhantomJS',
        browsers: ['Chrome', 'PhantomJS', 'Safari', 'Firefox'],
        //browsers: ['Chrome', 'Firefox', 'Safari'],
        //browsers: ['Firefox'],
        //browsers: ['PhantomJS'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,
        concurrency: Infinity,
        phantomjslauncher: {
            exitOnResourceError: true
        }
    });
};

// Karma configuration
// Generated on Thu Jul 23 2015 23:21:04 GMT-0400 (EDT)

module.exports = function (config) {
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['browserify', 'tap'],


		// list of files / patterns to load in the browser
		files: [
			//'node_modules/karma-babel-preprocessor/node_modules/babel-core/browser-polyfill.js',
			//'acme-vineyards-webflow/js/e750.js',
			'acme-vineyards-webflow/js/modules/**/*.js',
			'test/**/**/*.js'
		],


		// list of files to exclude
		exclude: [
			'acme-vineyards-webflow/js/*-compiled.js',
			'acme-vineyards-webflow/js/modernizr.js',
			'acme-vineyards-webflow/js/webflow.js'
		],


		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'acme-vineyards-webflow/js/**/*.js': ['browserify', 'sourcemap', 'coverage'],
			'test/**/*.js': ['browserify']
		},

		browserify: {
			debug: true,
			transform: ['babelify']
		},

		babelPreprocessor: {
			options: {
				sourceMap: 'inline',
				blacklist: ['useStrict']
			},
			sourceFileName: function (file) {
				return file.originalPath;
			}
		},

		coverageReporter: {
			instrumenters: {isparta: require('isparta')},
			instrumenter: {
				'acme-vineyards-webflow/js/**/*.js': 'isparta'
			},
			reporters: [
				{
					type: 'text-summary',
				},
				{
					type: 'html',
					dir: 'coverage/'
				}
			]
		},

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['progress', 'tape', 'coverage'],


		// web server port
		port: 9876,


		// enable / disable colors in the output (reporters and logs)
		colors: true,


		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_DEBUG,


		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,

		customLaunchers: {
			'ChromeES6': {
				base: 'Chrome',
				flags: ['--enable-javascript-harmony']
			}
		},

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		//browsers: ['Chrome', 'ChromeCanary', 'Firefox', 'Safari', 'PhantomJS'],
		browsers: ['ChromeES6'],


		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: true
	});
};

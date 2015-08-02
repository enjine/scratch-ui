'use strict'
// Karma configuration
// Generated on Thu Jul 23 2015 23:21:04 GMT-0400 (EDT)
var istanbul = require('browserify-istanbul');
var isparta = require('isparta');

module.exports = function (config) {
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['browserify', 'mocha', 'sinon-chai'],

		client: {
			mocha: {
				reporter: 'html', // change Karma's debug.html to the mocha web reporter
				ui: 'bdd'
			}
		},


		// list of files / patterns to load in the browser test runner
		files: [
			{pattern: './lib/**/*.js', included: false},
			{pattern: './test/**/*.js', included: true}
		],


		// list of files to exclude
		exclude: [],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			// create the ES5 equivalents of these ES6 modules, and run coverage.
			'./lib/**/*.js': ['browserify', 'babel', 'coverage'],
			// create the ES5 versions of the tests written in ES6 (these are included in the test runner page)
			'./test/**/*.js': ['browserify']
		},

		browserify: {
			debug: true,
			transform: [
				'babelify',
				istanbul({
					instrumenter: isparta,
					ignore: ['./node_modules/**', './test/**']
				})
			]
		},

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['mocha', 'coverage'],

		coverageReporter: {
			dir: './reports/coverage',
			reporters: [
				{type: 'html', subdir: 'html'}
			]
		},


		// web server port
		port: 9876,


		// enable / disable colors in the output (reporters and logs)
		colors: true,


		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_DISABLE,


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
		//browsers: ['ChromeES6', 'Chrome', 'ChromeCanaryES6', 'ChromeCanary', 'Firefox', 'Safari', 'PhantomJS'],
		browsers: ['Chrome'],


		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false
	});
};

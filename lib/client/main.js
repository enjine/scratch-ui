import 'core-js'; // Node module
import {Application} from './modules/components';

var e750 = function () {
	this.el = document.getElementsByTagName('body')[0];

	Object.assign(this, {
		fixtures: {},
		bootstrap: function (options){
			if (options.fixtures){
				this.fixtures = options.fixtures;
			}
		},
		start: function (options = {}) {
			this.bootstrap(options);
			//console.log('app init():', this, arguments);
			//console.log('cookies:', document.cookie);
			console.log('E750.js started....');
			this.attachNestedComponents();
			//TODO: implement this
			//this.attachPartials();
		}
	});

	this.onComponentsLoaded = function () {
		console.log('App received onComponentsLoaded', this, arguments);
	};

	this.subscribeOnce('componentsLoaded', this.onComponentsLoaded);

	this.once('willUpdateChildren', function () {
		console.log('App yip yip', this, arguments);
	});
};

e750.prototype = new Application();

var app = new e750();
document.addEventListener('DOMContentLoaded', app.start({fixtures: window.e750.FIXTURES}));

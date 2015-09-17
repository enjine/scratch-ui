import 'core-js'; // Node module
import {Application} from './com.e750/components';
//import {ElementPrototypeRemove, NodeListPrototypeRemove} from './com.e750/util/shims';

var e750 = function (rootEl, options) {
	console.log('new instance', this, arguments);
	Application.apply(this, arguments);
	//ElementPrototypeRemove.shim();
	//NodeListPrototypeRemove.shim();

	this.bootstrap(options);

	this.onComponentsLoaded = function () {
		console.log('App received onComponentsLoaded', this, arguments);
	};

	this.once('componentsLoaded', this.onComponentsLoaded);

	this.once('willUpdateChildren', function () {
		console.log('App yip yip', this, arguments);
	});

	this.start = function () {
		//console.log('app init():', this, arguments);
		//console.log('cookies:', document.cookie);
		console.log('E750.js started....', this, arguments);
		this.attachNestedComponents();
		//TODO: implement this
		//this.attachPartials();
	};

};

e750.prototype = Object.assign(Object.create(Application.prototype), {
	bootstrap: function (data = {}) {
		if (data.fixtures) {
			this.fixtures = data.fixtures;
		}
	}
});

var app = new e750('body', {fixtures: window.e750.FIXTURES});
document.addEventListener('DOMContentLoaded', app.start.bind(app));

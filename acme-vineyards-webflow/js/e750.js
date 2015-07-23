import 'core-js'; // Node module
import {Application, Resolver} from "./modules/components";

var e750 = function () {
	"use strict";
	Application.apply(this, arguments);
	this.el = document.getElementsByTagName("body")[0];

	Object.assign(this, Application.prototype, {
		fixtures: {},
		bootstrap: function(){
			if(window.e750.FIXTURES){
				this.fixtures = window.e750.FIXTURES;
			}
		},
		start: function (options = {}) {
			this.bootstrap();
			//console.log('app init():', this, arguments);
			//console.log('cookies:', document.cookie);
			console.log('E750.js started....');
			this.attachNestedComponents();
			//TODO: implement this
			//this.attachPartials();
		}
	});

	this.onComponentsLoaded = function() {
		console.log("App received onComponentsLoaded", this, arguments);
	};

	this.subscribeOnce('componentsLoaded', this.onComponentsLoaded);

	this.once("willUpdateChildren", function() {
		console.log('App yip yip', this, arguments)
	})



};

var app = new e750();
document.addEventListener('DOMContentLoaded', app.start());
console.log(app);
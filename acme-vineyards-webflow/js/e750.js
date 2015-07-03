//import 'core-js'; // Node module
import {Application, Resolver} from "./modules/components";

var e750 = function () {
	"use strict";

	Object.assign(this, Application.prototype, {
		start: function (options = {}) {
			console.log('app init():', this, arguments);
			console.log('cookies:', document.cookie);

			let components = [].slice.call(document.querySelectorAll("[data-component]"));
			let partials = [].slice.call(document.querySelectorAll("[data-partial]"));

			console.log('E750.js prototype started....');
			partials.forEach((partial) => {
				console.log('partial: ', partial);
			});

			// TODO: this needs to be put into a view manager that is on the BaseView prototype
			components.forEach((componentEl) => {
				let componentId = componentEl.dataset.component;
				console.log('component: ', this, componentId, componentEl, Resolver[componentId]);
				if (!this.componentInstances[componentId]) {
					this.componentInstances[componentId] = [];
				}
				this.componentInstances[componentId].push(new Resolver[componentId](componentEl));
			});

			console.log(this.componentInstances);
		}
	});

	this.on("registerComponents.complete", function () {
		console.log("received registerComponents.complete", this, arguments);
	});

};

var app = new e750();
document.addEventListener('DOMContentLoaded', app.start());

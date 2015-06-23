//import 'core-js'; // Node module
import {resolver} from "./modules/components";

// TODO: this needs to be an ApplicationView
var e750 = (function(){
	"use strict";

	var componentInstances = [];

	function init(){
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
			console.log('component: ', componentId, componentEl, resolver[componentId]);
			if(!componentInstances[componentId]){
				componentInstances[componentId] = [];
			}
			componentInstances[componentId].push(new resolver[componentId](componentEl));
		});

		console.log(componentInstances);
	}

	return {
		start: init
	}
})(window, undefined);

document.addEventListener('DOMContentLoaded', e750.start);

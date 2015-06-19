//import 'core-js'; // Node module
import {componentMap} from "./modules/components";

var e750 = (function(){
	"use strict";

	var componentInstances = {};

	function init(){
		console.log('cookies:', document.cookie);

		let components = [].slice.call(document.querySelectorAll("[data-component]"));
		let partials = [].slice.call(document.querySelectorAll("[data-partial]"));

		console.log('E750.js prototype started....');
		partials.forEach((partial) => {
			console.log('partial: ', partial);
		});

		components.forEach((componentEl) => {
			let componentId = componentEl.dataset.component;
			console.log('component: ', componentId, componentEl, componentMap[componentId]);
			componentInstances[componentId] = new componentMap[componentId](componentEl);
		});

		console.log(componentInstances);
	}

	return {
		start: init
	}
})(window, undefined);

document.addEventListener('DOMContentLoaded', e750.start);

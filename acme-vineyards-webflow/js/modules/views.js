import {resolver} from "./components";

export function BaseView(el, opts = {}) {
	"use strict";

	Object.assign(BaseView.prototype, {
		el: null,
		model: null,
		collection: null,
		template: null,
		childViews: {},

		render: () => {
			return this;
		},

		registerComponents: () => {
			console.log('registering child components for: ', this, arguments);

			let components = this.el.children;
			debugger;
			if (components.length) {
				console.log(components, typeof components, Object.keys(resolver));
				try {
					[].filter.call(components, (node, idx, arr) => {
						return node.dataset.component;
					})
				} catch (e) {
					console.error(e);
					throw e;
				}

				try {
					console.log('component: ', components);
					[].forEach.call(components, (componentEl) => {
						let componentId = componentEl.dataset.component;
						if (!this.childViews[componentId]) {
							this.childViews[componentId] = [];
						}

						if(resolver[componentId]){
							this.childViews[componentId].push(new resolver[componentId](componentEl));
							console.log('registered component: ', resolver[componentId], componentEl, this.childViews);
						}else{
							throw new ReferenceError(componentId + " not found in component resolver.", resolver)
						}

					});
				} catch (e) {
					console.error(e);
					throw e;
				}
			} else {
				console.info('No child components to register.')
			}
			return this;
		}
	});
};

export default {BaseView}

import {componentMap} from "./components";

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
				console.log(components, typeof components, Object.keys(componentMap));
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
						this.childViews[componentId].push(new componentMap[componentId](componentEl));

						console.log('component: ', componentMap[componentId], componentEl, this.childViews);
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

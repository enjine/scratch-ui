import {Resolver} from "./components";
import {Emitter, PubSub} from "./events";

export function BaseView(el, opts = {}) {};

Emitter(BaseView);
PubSub(BaseView);

Object.assign(BaseView.prototype, {
	options: {},
	el: null,
	model: null,
	collection: null,
	template: null,
	childViews: {},

	render: function () {
		return this;
	},

	updateChildren: function () {
		console.log('registering child components for: ', this, arguments);

		let components = this.el.children;
		//debugger;
		if (components.length) {
			console.log(components, typeof components, Object.keys(Resolver));
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

					if (Resolver[componentId]) {
						this.childViews[componentId].push(new Resolver[componentId](componentEl));
						console.log('registered component: ', Resolver[componentId], componentEl, this.childViews);
					} else {
						throw new ReferenceError(componentId + " not found in component resolver.", Resolver)
					}

				});
			} catch (e) {
				console.error(e);
				throw e;
			}
		} else {
			console.info('No child components to register.')
		}
		this.emit("registerComponents.complete", {test:true}, "wham!", [{whoo:"hoo"}]);
		return this;
	}
});



export default {BaseView}

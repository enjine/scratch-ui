import 'core-js';
import {Resolver} from './components';
import {Emitter} from './events';
import {isElement} from './util';

export function BaseView (el, options = {}) {
	this.options = {};

	Object.assign(this.options, options);

	let opts = this.options;

	this.el = isElement(el) ? el : document.createElement(el || this.defaults.el);
	this.model = opts.model || null;
	this.collection = opts.collection || null;
	this.template = opts.template || null;
	this.childViews = {};

	console.log('BaseView Constructor', this, arguments);
}

Emitter(BaseView);

Object.assign(BaseView.prototype, {
	defaults: {
		el: 'div'
	},

	render: function () {
		return this;
	},

	destroy: function (){
		this.childViews.forEach((view) => {
			view.destroy();
		});
		this.detachEvents();
		this.unmount();
	},

	addChildView: function (view) {
		let componentId = Resolver.getComponentId(view),
			childViews = this.childViews;
		if (!childViews[componentId]) {
			childViews[componentId] = [];
		}
		childViews[componentId].push(view);
		return this;
	},

	attachNestedComponents: function () {
		return this.updateChildren('[data-component]');
	},

	updateChildren: function (selector) {

		let components = selector ? this.el.querySelectorAll(selector) : this.el.children;

		//console.log('registering child components for: ', this, components);

		if (components.length) {
			this.emit('willUpdateChildren');
			//console.log(components, typeof components, Object.keys(Resolver));
			try {
				[].filter.call(components, (node) => {
					return node.dataset.component;
				});
			} catch (e) {
				console.error(e);
				throw e;
			}

			try {
				//console.log('components: ', components);
				[].forEach.call(components, (componentEl) => {
					let componentId = componentEl.dataset.component;
					if (!this.childViews[componentId]) {
						this.childViews[componentId] = [];
					}

					if (Resolver[componentId]) {
						this.childViews[componentId].push(new Resolver[componentId](componentEl));
						//console.info('registered component: ', componentId, Resolver[componentId]);
					} else {
						throw new ReferenceError(componentId + ' not found in component resolver.', Resolver);
					}
					this.emit('didUpdateChildren');
				});
			} catch (e) {
				console.error(e);
				throw e;
			}
		} else {
			console.info('No child components to register.');
		}

		this.emit('componentsLoaded');
		return this;
	}
});

export default {BaseView};

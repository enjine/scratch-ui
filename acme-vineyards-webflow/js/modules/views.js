import {Resolver} from './components';
import {Emitter, PubSub} from './events';

export function BaseView (el, opts = {}) {
	this.options = {};
	this.el = null;
	this.model = null;
	this.collection = null;
	this.template = null;
	this.childViews = {};
}

Emitter(BaseView);
PubSub(BaseView);

Object.assign(BaseView.prototype, {
	defaults: {
		el: 'div'
	},

	render: function () {
		return this;
	},

	addChildView: function (view){
		let componentId = Resolver.getComponentId(view);
		if (!this.childViews[componentId]) {
			this.childViews[componentId] = [];
		}
		this.childViews[componentId].push(view);
		return this;
	},

	attachNestedComponents: function (){
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

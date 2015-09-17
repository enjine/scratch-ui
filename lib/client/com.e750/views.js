import 'core-js';
import {Resolver} from './components';
import Evt from './Events';
import {isElement} from './util/DOMUtils';
import * as Util from './util/defaults';

const Events = Evt.EventsAPI;
const LookupTable = Util.LookupTable;

export function View (el, options = {}) {
	const reservedElements = [
		'HTML',
		'HEAD',
		'BODY'
	];
	this.options = {};

	Object.assign(this.options, options);

	let opts = this.options;
	this.el = isElement(el) ? el :
		(reservedElements.indexOf(el.toUpperCase())) ?
			document.getElementsByTagName(el)[0] :
			document.createElement(el || this.defaults.el);
	this.model = opts.model || null;
	this.collection = opts.collection || null;
	this.template = opts.template || null;
	this.childViews = Object.create(LookupTable);
}

Object.assign(View.prototype, Events, {
	defaults: {
		el: 'div'
	},

	render: function () {
		return this;
	},

	destroy: function () {
		let ret = [];
		Object.keys(this.childViews, (view) => {
			console.log('removing child view: ', view);
			ret.push(view.destroy());
		});
		ret.push(this.detachEvents(), this.unmount());
		return ret;
	},

	detachEvents: function () {
		return this.subscriptions.map((subscription) => {
			console.log('detaching event', this, subscription);
			let evt = subscription.evt,
				fn = subscription.fn;
			return this.off(evt, fn);
		});
	},

	unmount: function () {
		let el = this.el,
			parent = el.parentElement;
		if (!parent) {
			return true; //not in DOM;
		}
		try {
			return parent.removeChild(this.el);
		} catch (e) {
			console.error('Unable to unmount View.', e);
			return false;
		}
	},

	addChildView: function (view) {
		let componentId = Resolver.getComponentId(view),
			childViews = this.childViews;
		if (!childViews.has(componentId)) {
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

		console.log('registering child components for: ', this, components, selector, this.el.querySelectorAll(selector), this.el.children);

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
					if (!this.childViews.has(componentId)) {
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

		this.emit('componentsLoaded', {test: 'abcd'}, [1, 2, 3], true);
		return this;
	}
});

export default {View};

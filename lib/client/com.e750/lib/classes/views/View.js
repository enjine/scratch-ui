import 'core-js';
//import Resolver from '../../components/Resolver';
import Evented from '../events/Evented';
import {isElement} from '../../util/DOMUtils';
import LookupTable from '../../util/LookupTable';
//import ProductList from '../../components/ProductList';

export default class View extends Evented {
	constructor (el, options = {}) {
		super();
		this.options = {};

		console.log('VIEW!', this, arguments);

		Object.assign(this.options, options);

		if (el) {
			this.el = isElement(el) ? el :
				(View.reservedElements.indexOf(el.toUpperCase())) ?
					document.getElementsByTagName(el)[0] :
					document.createElement(el || View.defaults.el);
		}
		this.model = this.options.model || null;
		this.collection = this.options.collection || null;
		this.template = this.options.template || null;
		this.childViews = Object.create(LookupTable);
	}

	render () {
		return this;
	}

	destroy () {
		let ret = [];
		Object.keys(this.childViews, (view) => {
			console.log('removing child view: ', view);
			ret.push(view.destroy());
		});
		ret.push(this.detachEvents(), this.unmount());
		return ret;
	}

	detachEvents () {
		return this.subscriptions.map((subscription) => {
			console.log('detaching event', this, subscription);
			let evt = subscription.evt,
				fn = subscription.fn;
			return this.off(evt, fn);
		});
	}

	unmount () {
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
	}

	addChildView (view) {
		let componentId = Resolver.getComponentId(view),
			childViews = this.childViews;
		if (!childViews.has(componentId)) {
			childViews[componentId] = [];
		}
		childViews[componentId].push(view);
		return this;
	}

	attachNestedComponents () {
		return this.updateChildren('[data-component]');
	}

	updateChildren (selector) {

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
				console.log('components: ', components);
				[].forEach.call(components, (componentEl) => {
					let componentId = componentEl.dataset.component;
					if (!this.childViews.has(componentId)) {
						this.childViews[componentId] = [];
					}
					console.log('component: ', componentId);
					if (View.Resolver[componentId]) {
						this.childViews[componentId].push(new View.Resolver[componentId](componentEl, componentEl.dataset.options));
						//console.info('registered component: ', componentId, Resolver[componentId]);
					} else {
						throw new ReferenceError(componentId + ' not found in component resolver.', View.Resolver);
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
}

View.defaults = {
	el: 'div'
};

View.reservedElements = [
	'HTML',
	'HEAD',
	'BODY'
];

View.Resolver = {
	'ui/header': View,
	'ui/slider': View,
	'ui/intro': View,
	'cart/product-list': () => {}
};

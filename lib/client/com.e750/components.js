import 'core-js';
import {jst} from './core';
import {ProductCollection} from './collections';
import {View} from './views';
import {Product as ProductModel} from './models';
import {ui} from './cart';

export var Resolver = {
	'ui/header': ui.view,
	'ui/slider': ui.view,
	'ui/intro': ui.view,
	'cart/add': ui.addToCart,
	'cart/product-list': ui.productList,
	'cart/product/simple': ui.baseProduct,

	getComponentId: function (view) {
		return Object.getOwnPropertyNames(this).filter((componentId) => {
				//console.log('Get ComponentId:', Object.getPrototypeOf(view), view instanceof BaseView);
				return Object.getPrototypeOf(view).constructor === this[componentId];
			})[0] || null;

	}
};

export function Application () {
	View.apply(this, arguments);
}

Object.assign(Application.prototype, View.prototype, {
	start: function () {
		return this;
	},
	attachPartials: function () {
		return this.updateChildren('[data-partial]');
	}
});

export function Product (el, options = {}) {
	View.apply(this, arguments);
	this.el = document.createElement(options.el || this.defaults.el);
	this.model = options.model || ProductModel;
	this.template = options.template || jst.getFromDOM('product/simple');

	this.once('componentsLoaded', this.onComponentsLoaded.bind(this));

}
Object.assign(Product.prototype, View.prototype, {
	render: function () {
		try {
			this.el = jst.compile(this.template, this.model.serialize());
			this.attachNestedComponents();
			return this;
		} catch (e) {
			console.error(e);
			throw e;
		}
	},

	onComponentsLoaded: function () {
		console.log('Product received componentsLoaded', this, arguments);
	}
});

export function ProductList (el, options = {}) {
	View.apply(this, arguments);

	this.el = el;
	this.collection = new ProductCollection();


	this.once('componentsLoaded', this.onComponentsLoaded);

	this.on('otherEvent', () => {
		console.log('ProductList closure loaded', this, arguments);
	});

	this.on('willUpdateChildren', function () {
		console.log('ProductList yip yip', this, 'beep:', arguments);
	});

	this.on('click', (e) => {
		console.log('CLICKED', this, e);
	});

	this.on('submit', (e) => {
		console.log('SUBMITTED', this, e);
		e.preventDefault();
		return false;
	});


	var defaults = {
		url: '/api/products/',
		type: 'json',
		method: 'GET',
		headers: {
			'X-Auth-Token': document.cookie.split('=')[1]
		}
	}, fetchOpts = {};


	Object.assign(fetchOpts, defaults, options);
	console.log(this);
	this.collection.fetch(fetchOpts)
		.then(this.collection.parse.bind(this.collection), (reason) => {
			console.error('Parsing Failed! ', this, arguments, reason);
		})
		.then(() => {
			this.render();
		}, (reason) => {
			console.error('Render Failed! ', this, arguments, reason);
		})
		.catch((reason) => {
			console.error('Promise Rejected! ', this, arguments, reason);
		})
		.finally(() => {
			console.log('finally', this, arguments, options);
			//this.updateChildren();
		});

}

Object.assign(ProductList.prototype, View.prototype, {
	render: function () {
		try {
			let html = '',
				products = this.collection.models,
				product;

			for (let i = 0; i < products.length; i++) {
				let model = products[i];
				product = new Product('div', {model: model});
				//not crazy about this.
				product.model.set('quantities', window.e750.FIXTURES.quantities);
				product.render();
				this.addChildView(product);
				html += product.el.outerHTML;
			}

			this.el.innerHTML = html;
		} catch (e) {
			throw e;
		}
		return this;
	},

	onComponentsLoaded: function () {
		console.log('Product List received componentsLoaded', this, arguments);
	}

});

export function AddToCart (el, opts = {}) {
	View.apply(this, arguments);

	var defaults = {
		url: '/api/products/add',
		type: 'json',
		method: 'GET',
		headers: {
			'X-Auth-Token': document.cookie.split('=')[1]
		}
	}, options = {};


	Object.assign(options, defaults, opts);
}
Object.assign(AddToCart.prototype, View.prototype, {});

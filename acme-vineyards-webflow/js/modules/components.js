import {net, jst, storage} from "./core";
import {BaseView} from "./views";
import {ProductCollection} from "./collections";
import {ui} from './cart';

export var Resolver = {
	"ui/header": BaseView,
	"ui/slider": BaseView,
	"ui/intro": BaseView,
	"cart/add": ui.addToCart,
	"cart/product-list": ui.productList,
	"cart/product/simple": ui.baseProduct
};

export function Application() {
}
Object.assign(Application.prototype, BaseView.prototype, {
	componentInstances: {},
	start: function () {
	}
});

export function Product(options={}) {
	Object.assign(this, BaseView.prototype, {
		render: () => {
			console.log('^model vals^^ ',this.model.values);
			console.log('^model ser^^ ',this.model.serialize());
			this.el.innerHTML = jst.compile(this.template, this.model.serialize()) || "";

			this.on('focus', () => {
				console.log('onFocus', this, arguments);
			});

			console.log('Product render', this, arguments)
			return this
		}
	});

	this.el = document.createElement(options.el || 'div');
	this.model = options.model || null;
	this.template = options.template || null;



}

export function ProductList(el, opts = {}) {

	Object.assign(this, BaseView.prototype, opts, {
		parse: () => {

		},
		render: () => {
			console.log('* render *',this.collection);
			var template = jst.getFromDOM("product/simple"),
				html = "",
				products = this.collection.models,
				product;

			for (let i=0; i<products.length; i++) {
				let model = products[i];
				console.log('rrr', i, model, products);
				product = new Product({model:model, template:template});
				console.log('result:', product);
				html +=  product.render().el.innerHTML;
			}

			this.el.innerHTML = html;
			return this;
		},

		onComponentsLoaded: () => {
			console.log("Product List received componentsLoaded", this, arguments);
			this.on(this.el, 'click', (e) => {
				console.log('CLICKED', this, e);
			});

			this.on(this.el, 'submit', (e) => {
				console.log('SUBMITTED', this, e);
				e.preventDefault();
				return false;
			});
		}

	});

	this.el = el;
	this.collection = new ProductCollection();

	var defaults = {
		//url: "https://api.securecheckout.com/v1/cart/products/",
		url: "/api/products/",
		type: "json",
		method: "GET",
		headers: {
			"X-Auth-Token": document.cookie.split("=")[1]
		}
	}, options = {};


	Object.assign(options, defaults, opts);

	this.collection.fetch(options)
		.then(this.collection.parse.bind(this.collection), (reason) => {
			console.error("Parsing Failed! ", this, arguments);
		})
		.then(() => {
			this.render();
		}, (reason) => {
			console.error("Render Failed! ", this, arguments);
		})
		.catch((reason) => {
			console.error("Promise Rejected! ", this, arguments, document.cookie);
		})
		.finally(() => {
			console.log('finally', this, arguments, options);
			this.updateChildren();
		});

	console.log('component subscription');
	this.subscribe('componentsLoaded', this.onComponentsLoaded);

	console.log('component event handling');

	this.on('componentsLoaded', () => {
		console.log('ProductList closure loaded', this, arguments);
	});


}


export function AddToCart(el, opts = {}) {
	Object.assign(this, BaseView.prototype, {});

	var defaults = {
		//url: "https://api.securecheckout.com/v1/cart/products/",
		url: "/api/products/",
		type: "json",
		method: "GET",
		headers: {
			"X-Auth-Token": document.cookie.split("=")[1]
		}
	}, options = {};


	Object.assign(options, defaults, opts);

	console.log('ADD TO CART!', this, arguments);
}

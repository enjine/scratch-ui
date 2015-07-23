import {net, jst, storage} from "./core";
import {ProductCollection} from "./collections";
import {BaseView} from "./views";
import {Product as ProductModel} from "./models";
import {ui} from './cart';

export var Resolver = {
	"ui/header": ui.view,
	"ui/slider": ui.view,
	"ui/intro": ui.view,
	"cart/add": ui.addToCart,
	"cart/product-list": ui.productList,
	"cart/product/simple": ui.baseProduct,
	getComponentId: function(view){
		return Object.getOwnPropertyNames(this).filter((componentId) => {
			return view.__proto__.constructor === this[componentId];
		})[0] || null;

	}
};

export function Application() {
	"use strict";
	BaseView.apply(this, arguments);
}

Object.assign(Application.prototype, BaseView.prototype, {
	start: function () {
		return this;
	},
	attachPartials: function(){
		return this.updateChildren("[data-partial]");
	}
});

export function Product(options={}) {
	BaseView.apply(this, arguments);

	Object.assign(this, BaseView.prototype, {
		render: () => {
			try {
				this.el = jst.compile(this.template, this.model.serialize());
				this.attachNestedComponents();
				return this;
			} catch (e){
				console.error(e);
				throw(e);
			}
		},

		onComponentsLoaded: function(){
			console.log('Product received componentsLoaded', this, arguments);
		}
	});

	this.el = document.createElement(options.el || this.defaults.el);
	this.model = options.model || ProductModel;
	this.template = options.template || jst.getFromDOM("product/simple");

	this.subscribeOnce("componentsLoaded", this.onComponentsLoaded);

}

export function ProductList(el, options = {}) {
	BaseView.apply(this, arguments);

	Object.assign(this, BaseView.prototype, {
		render: () => {
			try {
				let html = "",
				products = this.collection.models,
				product;

				for (let i=0; i<products.length; i++) {
					let model = products[i];
					product = new Product({model:model});
					product.model.set("quantities", window.e750.FIXTURES.quantities);
					product.render();
					this.addChildView(product);
					html +=  product.el.outerHTML;
				}

				this.el.innerHTML = html;
			}catch(e){
				throw e;
			}
			return this;
		},

		onComponentsLoaded: function() {
			console.log("Product List received componentsLoaded", this, arguments);
		}

	});


	this.el = el;
	this.collection = new ProductCollection();


	this.subscribeOnce('componentsLoaded', this.onComponentsLoaded);

	this.on('otherEvent', () => {
		console.log('ProductList closure loaded', this, arguments);
	});

	this.on("willUpdateChildren", function() {
		console.log('ProductList yip yip', this, 'beep:', arguments)
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
		url: "/api/products/",
		type: "json",
		method: "GET",
		headers: {
			"X-Auth-Token": document.cookie.split("=")[1]
		}
	}, fetchOpts = {};


	Object.assign(fetchOpts, defaults, options);

	this.collection.fetch(fetchOpts)
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
			//this.updateChildren();
		});

}


export function AddToCart(el, opts = {}) {
	BaseView.apply(this, arguments);
	Object.assign(this, BaseView.prototype, {});

	var defaults = {
		url: "/api/products/add",
		type: "json",
		method: "GET",
		headers: {
			"X-Auth-Token": document.cookie.split("=")[1]
		}
	}, options = {};


	Object.assign(options, defaults, opts);
}

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
			this.el.innerHTML = jst.compile(this.template, this.model.serialize()) || "";
			return this
		},

		onComponentsLoaded: function(){
			console.log('product HERE!!', this, arguments);
			this.emit('mouseenter')
		}
	});

	this.el = document.createElement(options.el || 'div');
	this.model = options.model || ProductModel;
	this.template = options.template || jst.getFromDOM("product/simple");

	this.subscribe("componentsLoaded", this.onComponentsLoaded.bind(this));

	this.on('mouseenter', () => {
		console.log('HOVERED', this, arguments);
	});

}

export function ProductList(el, opts = {}) {

	Object.assign(this, BaseView.prototype, opts, {
		render: () => {
			try {
				let html = "",
				products = this.collection.models,
				product;

			for (let i=0; i<products.length; i++) {
				let model = products[i];
				product = new Product({model:model});
				html +=  product.render().el.innerHTML;
			}

			this.el.innerHTML = html;
			}catch(e){
				throw e;
			}
			return this;
		},

		onComponentsLoaded: () => {
			console.log("Product List received componentsLoaded", this, arguments);

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

	this.on('otherEvent', () => {
		console.log('ProductList closure loaded', this, arguments);
	});

	this.on('click', (e) => {
			console.log('CLICKED', this, e);
	});

	this.on('submit', (e) => {
		console.log('SUBMITTED', this, e);
		e.preventDefault();
		return false;
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

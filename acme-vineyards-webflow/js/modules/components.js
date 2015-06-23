import {net, jst, storage} from "./core";
import {BaseView} from "./views";
import {ProductCollection} from "./collections";
import {ui} from './cart';

export var componentMap = {
		"ui/header": BaseView,
		"ui/slider": BaseView,
		"ui/intro": BaseView,
		"cart/add": ui.addToCart,
		"cart/product-list": ui.productList,
		"cart/product/simple": ui.baseProduct
	};

export function Product() {
	Object.assign(this, BaseView.prototype);
}

export function ProductList(el, opts = {}) {

	Object.assign(this, BaseView.prototype, {
		render: (results, el) => {
			var template = jst.getFromDOM("product/simple"),
				html = "";

			for (let obj in results) {
				html += template(results[obj]);
			}

			el.innerHTML = html;
			return this;
		}

	});

	this.el = el;


	var defaults = {
		//url: "https://api.securecheckout.com/v1/cart/products/",
		url: "/api/products/",
		type: "json",
		method: "GET",
		headers: {
			"X-Auth-Token": document.cookie.split("=")[1]
		}
	}, options = {};

	this.collection = new ProductCollection();

	Object.assign(options, defaults, opts);

	this.collection.fetch(options)
		.then(this.collection.parse, (reason) => {
			console.error("Parsing Failed! ", this, arguments);
		})
		.then((response) => {
			this.render(response, this.el);
		}, (reason) => {
			console.error("Render Failed! ", this, arguments);
		})
		.catch((reason) => {
			console.error("Promise Rejected! ", this, arguments, document.cookie);
		})
		.finally(() => {
			console.log('finally', this, arguments, options);
			this.registerComponents();
		});
}


export function AddToCart(el, opts = {}){
	Object.assign(this, BaseView.prototype, {


	});

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
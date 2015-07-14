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

export function Product() {
	Object.assign(this, BaseView.prototype);
}

export function ProductList(el, opts = {}) {

	Object.assign(this, BaseView.prototype, opts, {
		render: (results) => {
			console.log('* render *')
			var template = jst.getFromDOM("product/simple"),
				html = "";

			for (let obj in results) {
				html += jst.compile(template, results[obj]);
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
		.then((response) => {
			this.render(response);
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

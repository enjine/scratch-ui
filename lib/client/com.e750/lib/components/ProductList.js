import 'core-js';
import Component from './Component';
import Product from './Product';
import ProductCollection from '../classes/collections/Product';

export default class ProductList extends Component {
	constructor (el, options = {}) {
		super(el, options);

		//TODO: Refactor this

		this.collection = new ProductCollection();


		this.onComponentsLoaded = function () {
			console.log('Product List received componentsLoaded', this, arguments);
		};

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

	render () {
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
	}
}

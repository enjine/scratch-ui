import Component from './Component';
import Product from './Product';
import ProductCollection from '../classes/collections/Product';

export default class ProductList extends Component {
	setInitialState () {
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


		Object.assign(fetchOpts, defaults, this.options);
		console.log('PRODUCT LIST:', this);
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
				model.set('quantities', window.e750.FIXTURES.quantities);
				product = new Product('div', {model: model});
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

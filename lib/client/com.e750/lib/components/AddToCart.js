import 'core-js';
import Component from './Component';

export default class AddToCart extends Component {
	constructor (el, options = {}) {
		super(el, options);

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

	onSubmit () {

	}
}

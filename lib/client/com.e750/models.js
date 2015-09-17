import 'core-js';
import {net} from './core';
import Evt from './Events';
import guid from './util/Guid.js';

const Events = Evt.EventsAPI;

var attributes = {
	id: null,
	_guid: new guid().value,
	all: function () {
		let values = {};
		Object.keys(this).map((p) => {
			values[p] = this[p];
		});

		return values;
	}
};


export function Model (props = {}, options = {}) {
	this.listenerId = new guid();
	this.options = options;
	this.values = Object.create(attributes);

	Object.assign(this.values, this.defaults || {});

	if (props) {
		this.parse(props);
	}
}


Object.assign(Model.prototype, Events, {
	setId: function (val) {
		let id = Number(val);
		if (!isNaN(id)) {
			this.values.id = id;
		} else {
			throw new TypeError('ID attribute value must be a number.');
		}
	},

	/**
	 * returns an A+ promise
	 * @param options
	 * @returns {*}
	 */
	fetch: function (options) {
		try {
			this.emit('beforeFetch');
			return net.http.get(options);
		} catch (e) {
			console.error(e);
			//throw e;
		}
	},

	parse: function (data) {
		//console.log('parsing model', data, Object.keys(data).length);
		try {
			if (Object.keys(data).length > 0) {
				for (let prop in data) {
					if (data.hasOwnProperty(prop)) {
						this.set(prop, data[prop]);
					}
				}
			} else {
				throw new Error('Data has zero length.');
			}
		} catch (e) {
			console.error(e);
			//throw e;
		}

		return this;
	},

	get: function (propName) {
		try {
			let prop = this.values[propName];
			return (typeof prop === 'function') ? prop() : prop;
		} catch (e) {
			throw new ReferenceError('Property `' + propName + '` not found in ' + this.constructor.name);
		}
	},

	set: function (propName, value) {
		//console.log('attempting to set `' + propName + '` = `' + value + '`', this.values[propName]);
		if (propName.indexOf('custom') !== -1) {
			let customProp = {};
			customProp[propName] = value;
			Object.assign(this.values, customProp);
		} else if (this.values[propName] !== undefined) {
			if (propName.toLowerCase() === 'id') {
				this.setId(value);
			} else {
				this.values[propName] = value;
			}
		} else {
			throw new ReferenceError('Property `' + propName + '` is not settable for ' + this.constructor.name + '. Add `' + propName + '` to the `defaults` on this model to enable it as settable.');
		}

		return this;
	},

	serialize: function () {
		return this.values.all();
	},

	toJSON: function () {
		return JSON.stringify(this.values.all(), null, 0);
	},

	toMeta: function (transformer, options) {
		return JSON.stringify(transformer(this.values.all(), options), null, 0);
	}
});


export var Product = function (props = {}, options = {}) {

	this.defaults = {
		name: '',
		sku: '',
		price: '',
		description: '',
		status: '',
		accolades_01: '',
		additional_description: '',
		aging: '',
		alcohol: '',
		appellation: '',
		blend: '',
		bottle_count: '',
		bottle_size: '',
		case_production: '',
		country: '',
		farming_method: '',
		featured_product: '',
		free_shipping: '',
		harvest_date: '',
		image: '',
		image_alt: '',
		max_purchase_quantity: '',
		new_product: '',
		not_availible_message: '',
		oak: '',
		ph: '',
		qb_account: '',
		qb_class: '',
		qb_sku: '',
		region: '',
		release_date: '',
		residual_sugar: '',
		retail_price: '',
		short_description: '',
		soil: '',
		starting_quantity: '',
		status_availability: '',
		subtitle: '',
		sub_region: '',
		ta: '',
		upc: '',
		varietal: '',
		vineyard: '',
		vintage: '',
		winemaker: '',
		wine_type: '',
		categories: { // this should be an array
			2: {
				id: '',
				name: '',
				sort: ''
			}
		},
		quantity: '',
		quantities: '',
		cost: '',
		image_alt_3: '',
		no_comparison: '',
		shipping_offer_min: '',
		label: '',
		review: '',
		tasting_notes_pdf: '',
		product_category: '',
		reviewer: '',
		tax_exempt: '',
		score: '',
		min_purchase_quantity: 0

	};

	Model.apply(this, arguments);
};

Object.assign(Product.prototype, Model.prototype, {
	foo: function () {

	}
});
export default {Model, Product};

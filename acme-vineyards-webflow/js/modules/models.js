import {net} from "./core";

var _attributes = {
	_guid: null,
	_some_other_global_property: null,
	all: function () {
		let values = {};
		for (let p in this.getOwnPropertyNames) {
			values[p] = _attributes[p];
		}
	}
};


export function BaseModel(options = {}) {
	Object.assign(this.options, options);
}


Object.assign(BaseModel.prototype, {
	options: {},
	values: Object.create(_attributes),

	/**
	 * returns an A+ promise
	 * @param options
	 * @returns {*}
	 */
	fetch: function(options) {
		// TODO: trigger beforeAsync, beforeFetch
		console.log('fetch', this, arguments);
		return net.http.get(options);
	},

	parse: function(response) {
		if (Object.keys(response).length > 0) {
			console.log("Parsing response: ", this, response);
			return response;
		} else {
			console.error("Response has zero length.");
			return false;
		}
	},

	serialize: function() {}
});


export var Product = function (options) {
	let defaults = {
		id: "",
		name: "",
		sku: "",
		price: "",
		description: "",
		status: "",
		accolades_01: "",
		additional_description: "",
		aging: "",
		alcohol: "",
		appellation: "y",
		blend: "",
		bottle_count: "",
		bottle_size: "",
		case_production: "",
		country: "",
		farming_method: "",
		featured_product: "",
		free_shipping: "",
		harvest_date: "",
		image: "",
		image_alt: "",
		max_purchase_quantity: "",
		new_product: "",
		not_availible_message: "",
		oak: "",
		ph: "",
		qb_account: "",
		qb_class: "",
		qb_sku: "",
		region: "",
		release_date: "",
		residual_sugar: "",
		retail_price: "",
		short_description: "",
		soil: "",
		starting_quantity: "",
		status_availability: "",
		subtitle: "",
		sub_region: "",
		ta: "",
		upc: "",
		varietal: "",
		vineyard: "",
		vintage: "",
		winemaker: "",
		wine_type: "",
		categories: { // this should be an array
			2: {
				id: "",
				name: "",
				sort: ""
			}
		},
		quantity: ""
	};

	Object.assign(this, BaseView.prototype, options);
	Object.assign(this.values, defaults);

};

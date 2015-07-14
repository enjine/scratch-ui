import {net} from "./core";

var _attributes = {
	_guid: null,
	_some_other_global_property: null,
	all: function () {
		let values = {};
		Object.getOwnPropertyNames(this).map((p) => {
			values[p] = this[p];
		});

		return values;
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

	parse: function(data) {
		if (Object.keys(data).length > 0) {
			//console.log("Parsing MODEL data: ", data);
			for(let prop in data){
				if(data.hasOwnProperty(prop)){
					//console.log('setting ', prop, "=", data[prop]);
					//Object.assign(this.values,{prop: data[prop]});
					this.values[prop] = data[prop];
					//console.log('set:',this.values[prop]);
				}
			}
			console.log('eep', this.values.all());
		} else {
			console.error("data has zero length.");
		}

		return this;
	},

	serialize: function(){
		return this.values.all();
	},

	toJSON: function() {
		JSON.stringify(this.values);
	},

	toMeta: function(){
		this.values.map(() => {
			console.log(this, arguments);
		});
	}
});


export var Product = function (props) {
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
		appellation: "",
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

	Object.assign(this, BaseModel.prototype);
	Object.assign(this.values, defaults);
	if(props){
		this.parse(props);
	}

};

import 'core-js';
import {Model, Product} from './models';
import Evt from './Events';

const Events = Evt.EventsAPI;

export var Collection = function (options = {}) {
	Object.assign(this, options);

	this.models = [];
};


Object.assign(Collection.prototype, Events, {
	model: Model,
	fetch: Model.prototype.fetch,
	parse: function (data) {
		//console.log('incoming model data:', data, Object.getOwnPropertyNames(data), data.length);
		try {
			if (data.length) {
				let item;
				for (item in data) {
					if (data.hasOwnProperty(item)) {
						let m = new this.model(data[item]);
						//console.log('new model:', m, item, 'data:', data[item]);
						this.models.push(m);
					}
				}
			} else {
				throw new Error('Response was empty.');
			}
		} catch (e) {
			console.error(e);
			//throw e;
		}

		return this;
	},

	serialize: function (){
		return this.models.map((model) => {
			return model.serialize();
		});
	},

	toJSON: function(){
		return JSON.stringify(this.models.map((model) => {
			return model.serialize();
		}), null, 0);
	},

	toMeta: function (transformer, options) {
		return JSON.stringify(transformer.collection(this.models.map((model) => {
			return transformer.model(model.serialize());
		}), options), null, 0);
	}
});

export function ProductCollection (options) {
	Collection.apply(this, arguments);
	this.model = (options && options.model) ? options.model : Product;

}

Object.assign(ProductCollection.prototype, Collection.prototype, {
	foo: true
});


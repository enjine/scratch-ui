import 'core-js';
import {BaseModel, Product} from './models';
import {Emitter} from './events';
import {inherits} from './util';


export var BaseCollection = function (options = {}) {
	Object.assign(this, options);

	this.models = [];
};

Emitter(BaseCollection);

Object.assign(BaseCollection.prototype, {
	model: BaseModel,
	fetch: BaseModel.prototype.fetch,
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
	}
});

export function ProductCollection (options) {
	BaseCollection.apply(this, arguments);
	this.model = (options && options.model) ? options.model : Product;

}

inherits(ProductCollection, BaseCollection);

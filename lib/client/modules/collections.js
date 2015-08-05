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
		//console.log('incoming model data:', data);
		try {
			if (Object.getOwnPropertyNames(data).length) {
				for (let item in data) {
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
			throw e;
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

	toMeta: function(){
		return this.models.map((model) => {
			return model.toMeta();
		});
	}
});

export function ProductCollection (options) {
	this.model = (options && options.model) ? options.model : Product;
	BaseCollection.apply(this, arguments);

}
// what i learned about prototypal inheritance:
// ex 1: ProductCollection.prototype = Object.create(BaseCollection.prototype);
	// this makes the constructor = BaseCollection(), which means you don't need to call apply in ProductCollection,
	// but instanceof ProductCollection will be false
// ex 2: Object.assign(ProductCollection.prototype, BaseCollection.prototype);
	// with this you get ProductCollection() as the constructor and you get a copy of BaseCollection.prototype,
	// but instanceof BaseCollection will be false
// ex 3: ProductCollection.prototype = inherits(BaseCollection, ProductCollection);
	// this is probably the most `correct` way to do it because:
		// let PC = new ProductCollection();
		// console.info(PC.constructor) // ProductCollection
		// console.info(PC instanceof BaseCollection); // true
		// console.info(PC instanceof ProductCollection); // true
	// ^^ everything checks out to be what you'd expect.
ProductCollection.prototype = inherits(BaseCollection, ProductCollection);

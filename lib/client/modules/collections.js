import 'core-js';
import {BaseModel, Product} from './models';
import {Emitter} from './events';


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
	toJSON: BaseModel.prototype.toJSON,
	toMeta: BaseModel.prototype.toMeta
});

export function ProductCollection () {
	BaseCollection.apply(this, arguments);

	this.model = Product;

}
// this makes the constructor = BaseCollection(), and you don't need to call apply
//ProductCollection.prototype = Object.create(BaseCollection.prototype);
// with this you get ProductCollection as the constructor and it just copies BaseCollection.prototype over
Object.assign(ProductCollection.prototype, BaseCollection.prototype);

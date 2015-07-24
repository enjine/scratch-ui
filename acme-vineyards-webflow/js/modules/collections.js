import 'core-js';
import {BaseModel, Product} from './models';
import {Emitter, PubSub} from './events';


export var BaseCollection = function (options = {}) {
	Object.assign(this, options);

	this.models = [];
};

Emitter(BaseCollection);
PubSub(BaseCollection);

Object.assign(BaseCollection.prototype, {
	model: BaseModel,
	fetch: BaseModel.prototype.fetch,
	parse: function (data){
		//console.log('incoming model data:', data);;
		try {
			for (let item in data){
				if (data.hasOwnProperty(item)){
					let m = new this.model(data[item]);
					//console.log('new model:', m, item, 'data:', data[item]);
					this.models.push(m);
				}
			}
			//console.log('collection set:', this.models);
		} catch(e){
			console.error(e);
			throw e;
		}

		return this;
	},
	toJSON: BaseModel.prototype.toJSON,
	toMeta: BaseModel.prototype.toMeta
});

export function ProductCollection () {
	Object.assign(this, BaseCollection.prototype);
	BaseCollection.apply(this, arguments);

	this.model = Product;

	//BaseCollection.constructor(options);
	//console.log('product collection', this, arguments)
}


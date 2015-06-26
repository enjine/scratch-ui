import {BaseModel, Product} from './models';


var BaseCollection = function(ptions = {}) {
	Object.assign(this, options);
};

Object.assign(BaseCollection.prototype, {
	models: [],
	model: BaseModel,
	fetch: BaseModel.prototype.fetch,
	parse: BaseModel.prototype.parse,
	toJSON: BaseModel.prototype.toJSON,
	toMeta: BaseModel.prototype.toMeta
});

export function ProductCollection(options) {
	Object.assign(this, BaseCollection.prototype, options);
	this.model = Product;
	//BaseCollection.constructor(options);
	console.log('product collection', this, arguments)
}


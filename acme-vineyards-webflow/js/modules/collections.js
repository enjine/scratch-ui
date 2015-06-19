import {BaseModel, Product} from './models';


var BaseCollection = function(options) {
	Object.assign(this, options);
};

Object.assign(BaseCollection.prototype, {
	model: BaseModel,
	fetch: BaseModel.prototype.fetch,
	parse: BaseModel.prototype.parse
});

export function ProductCollection(options) {
	Object.assign(this, BaseCollection.prototype, options);
	//BaseCollection.constructor(options);
	console.log('product collection', this, arguments)
}


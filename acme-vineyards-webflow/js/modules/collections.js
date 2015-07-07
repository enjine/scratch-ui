import {BaseModel, Product} from './models';


var BaseCollection = function(options = {}) {
	Object.assign(this, options);
};

Object.assign(BaseCollection.prototype, {
	models: [],
	model: BaseModel,
	fetch: BaseModel.prototype.fetch,
	parse: function(){
		var response = BaseModel.prototype.parse.apply(this, arguments);
		if(response === false){
			return response;
		}
		try {
			for(let item in response){
				if(response.hasOwnProperty(item)){
					console.log('mapping response:', response[item]);
					this.collection.models.push(new this.collection.model(response[item]));
				}
			}
		} catch(e){
			console.error(e)
			throw e;
		}
		return this.collection.models;
	},
	toJSON: BaseModel.prototype.toJSON,
	toMeta: BaseModel.prototype.toMeta
});

export function ProductCollection(options) {
	Object.assign(this, BaseCollection.prototype, options);
	this.model = Product;
	//BaseCollection.constructor(options);
	console.log('product collection', this, arguments)
}


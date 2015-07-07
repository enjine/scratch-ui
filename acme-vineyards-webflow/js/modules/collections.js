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
					this.models.push(new this.model(response[item]));
				}
			}
		} catch(e){
			console.error(e)
			throw e;
		}
		return this.models;
	},
	toJSON: BaseModel.prototype.toJSON,
	toMeta: BaseModel.prototype.toMeta
});

export function ProductCollection(options) {
	Object.assign(this, BaseCollection.prototype, options);
	this.model = Product;

	console.log('product collection', this, arguments)
}


import {BaseModel, Product} from './models';


var BaseCollection = function(options = {}) {
	Object.assign(this, options);
};

Object.assign(BaseCollection.prototype, {
	models: [],
	model: BaseModel,
	fetch: BaseModel.prototype.fetch,
	parse: function(data){
		console.log('incoming model data:', data);;
		try {
			for(let item in data){
				if(data.hasOwnProperty(item)){
					// ! ! ISSUES ! !
					debugger;
					let m = new this.model(data[item]);
					console.log('new model:', m, item, 'data:', data[item]);
					this.models.push(m);
				}
			}
			console.log('collection set:', this.models);
		} catch(e){
			console.error(e)
			throw e;
		}

		return this;
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


import Evented from '../events/Evented';
import Model from '../../classes/models/Model';

console.log('coll', Evented);

export default class Collection extends Evented {
	constructor (options = {}) {
		super();

		Object.assign(this, options);

		this.models = [];
	}

	parse (data) {
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
	}

	serialize () {
		return this.models.map((model) => {
			return model.serialize();
		});
	}

	toJSON () {
		return JSON.stringify(this.models.map((model) => {
			return model.serialize();
		}), null, 0);
	}

	toMeta (transformer, options) {
		return JSON.stringify(transformer.collection(this.models.map((model) => {
			return transformer.model(model.serialize());
		}), options), null, 0);
	}
}

Collection.model = Model;
Collection.fetch = Model.prototype.fetch;


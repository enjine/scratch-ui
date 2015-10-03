import Evented from '../../behaviors/Evented';
import {net} from '../../core';
import Model from '../../classes/models/Model';
import Initializable from '../../behaviors/Initializable';
import mixes from '../../util/mixes';
import Evt from '../../event/Registry';

let overrides = {
	setInitialProps: function (models = [], options = {}) {
		this.options = {};
		Object.assign(this.options, options);
		this.model = (options.model) ? options.model : Model;
		this.models = models;
	}
};

@mixes(Evented, Initializable, overrides)
export default class Collection {
	constructor (models = [], options = {}) {
		this.setInitialProps(models, options);
		this.setInitialState();
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

	/**
	 * returns an A+ promise
	 * @param options
	 * @returns {*}
	 */
	fetch (options) {
		try {
			this.emit(Evt.BEFORE_FETCH);
			return net.http.get.call(this, options);
		} catch (e) {
			console.error(e);
			//throw e;
		}
	}
}

Collection.model = Model;


import 'core-js';
import {net} from '../../core';
import Evented from '../events/Evented';
import guid from '../../util/Guid.js';


let attributes = {
	id: null,
	_guid: guid(),
	all: function () {
		let values = {};
		Object.keys(this).map((p) => {
			values[p] = this[p];
		});

		return values;
	}
};

export default class Model extends Evented {
	constructor (props = {}, options = {}) {
		super();

		this.options = options;
		this.values = Object.create(attributes);

		Object.assign(this.values, this.defaults || {});

		if (props) {
			this.parse(props);
		}
	}

	setId (val) {
		let id = Number(val);
		if (!isNaN(id)) {
			this.values.id = id;
		} else {
			throw new TypeError('ID attribute value must be a number.');
		}
	}

	/**
	 * returns an A+ promise
	 * @param options
	 * @returns {*}
	 */
	fetch (options) {
		try {
			this.emit('beforeFetch');
			return net.http.get(options);
		} catch (e) {
			console.error(e);
			//throw e;
		}
	}

	parse (data) {
		//console.log('parsing model', data, Object.keys(data).length);
		try {
			if (Object.keys(data).length > 0) {
				for (let prop in data) {
					if (data.hasOwnProperty(prop)) {
						this.set(prop, data[prop]);
					}
				}
			} else {
				throw new Error('Data has zero length.');
			}
		} catch (e) {
			console.error(e);
			//throw e;
		}

		return this;
	}

	get (propName) {
		try {
			let prop = this.values[propName];
			return (typeof prop === 'function') ? prop() : prop;
		} catch (e) {
			throw new ReferenceError('Property `' + propName + '` not found in ' + this.constructor.name);
		}
	}

	set (propName, value) {
		//console.log('attempting to set `' + propName + '` = `' + value + '`', this.values[propName]);
		if (propName.indexOf('custom') !== -1) {
			let customProp = {};
			customProp[propName] = value;
			Object.assign(this.values, customProp);
		} else if (this.values[propName] !== undefined) {
			if (propName.toLowerCase() === 'id') {
				this.setId(value);
			} else {
				this.values[propName] = value;
			}
		} else {
			throw new ReferenceError('Property `' + propName + '` is not settable for ' + this.constructor.name + '. Add `' + propName + '` to the `defaults` on this model to enable it as settable.');
		}

		return this;
	}

	serialize () {
		return this.values.all();
	}

	toJSON () {
		return JSON.stringify(this.values.all(), null, 0);
	}

	toMeta (transformer, options) {
		return JSON.stringify(transformer(this.values.all(), options), null, 0);
	}

}

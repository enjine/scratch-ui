import mixes from 'lib/util/mixes';
import Evented from 'lib/behaviors/Evented';
import {net} from 'lib/core';
import guid from 'lib/util/guid';
import Evt from 'lib/event/Registry';

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

@mixes(Evented)
export default class Model {
    constructor (props, options) {
        this.initProps(props, options);
        this.initState();
    }

    initState () {
        return this;
    }

    initProps (props, options) {
        this.options = {};
        Object.assign(this.options, options);
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
     * returns a native promise
     * @param url
     * @param options
     * @returns {Promise}
     */

    request (url, options) {
        console.log('models::request', options);
        if (!options.method) {
            return net.http.getJSON.call(this, url, options);
        }

        switch (options.method.toUpperCase()) {
            case 'POST':
                return net.http.postJSON.call(this, url, options.data || {}, options);
            case 'GET':
            default:
                return net.http.getJSON.call(this, url, options);
        }
    }

    fetch (options = {}) {
        let res;
        try {
            this.emit(Evt.BEFORE_REQUEST);
            res = this.request(options.url, options);
        } catch (e) {
            console.error(e);
            //throw e;
        }
        return res;
    }

    parse (data) {
        if (Object.keys(data).length > 0) {
            for (let prop in data) {
                if (data.hasOwnProperty(prop)) {
                    this.set(prop, data[prop]);
                }
            }
        }
        return this;
    }

    get (propName) {
        try {
            let prop = this.values[propName];
            return typeof prop === 'function' ? prop.call(this) : prop;
        } catch (e) {
            console.error(e);
            throw new ReferenceError('Property `' + propName + '` not found in ' + this.constructor.name);
        }
    }

    set (propName, value) {
        if (propName.toLowerCase() === 'id') {
            this.setId(value);
        } else {
            this.values[propName] = value;
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

export {Model};

import {net} from '../../core';
import Evented from '../../behaviors/Evented';
import guid from '../../util/Guid.js';
import Initializable from '../../behaviors/Initializable';
import mixes from '../../util/mixes';
import Evt from '../../event/Registry';

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

let overrides = {
    setInitialProps: function (props) {
        this.values = Object.create(attributes);

        Object.assign(this.values, this.defaults || {});

        if (props) {
            this.parse(props);
        }

    }
};

@mixes(Evented, Initializable, overrides)
export default
class Model {
    constructor (props, options) {
        Initializable.setInitialProps.call(this, options);
        this.setInitialProps(props);
        this.setInitialState();
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
            this.emit(Evt.BEFORE_FETCH);
            return net.http.get.call(this, options);
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
            return (typeof prop === 'function') ? prop.call(this) : prop;
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

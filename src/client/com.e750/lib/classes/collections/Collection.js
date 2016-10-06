import mixes from 'lib/util/mixes';
import Evented from 'lib/behaviors/Evented';
import {net} from 'lib/core';
import Model from 'lib/classes/models/Model';
import Evt from 'lib/event/Registry';


@mixes(Evented)
export default class Collection {
    constructor (data = [], options = {}) {
        this.options = {};
        Object.assign(this.options, options);
        this.modelClass = options.modelClass || Collection.modelClass;
        this.initProps(data, options);
        this.initState();
    }

    initState () {
        return this;
    }

    initProps (data, options) {
        this.model = options.modelClass ? new options.modelClass(data) : options.model || new this.modelClass(data);
        this.models = [];
        this.parse(data);
    }

    add (data) {
        let m = data;
        if (!m instanceof this.modelClass) {
            m = new this.modelClass(data);
        }
        this.models.push(m);
        this.emit(Evt.COLLECTION_ADD, m);
    }

    remove (index) {
        try {
            let removed = this.models.splice(index, 1);
            if (removed.length) {
                this.emit(Evt.COLLECTION_REMOVE, removed[0]);
            }
        } catch (e) {
            console.error('No item found at index `' + index + '`.', e);
        }
    }

    length () {
        return this.models.length;
    }

    parse (data) {
        //console.log('incoming model data:', data, Object.getOwnPropertyNames(data), data.length);
        try {
            if (!data) throw new Error('Incoming data has zero length');

            if (data[0] instanceof this.modelClass) {
                data.forEach((m) => {
                    this.add(m);
                });
            } else {
                let item;
                for (item in data) {
                    if (data.hasOwnProperty(item)) {
                        let m = new this.modelClass(data[item]);
                        //console.log('new model:', m, item, 'data:', data[item]);
                        this.add(m);
                    }
                }
            }
        } catch (e) {
            console.warn(e);
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

    request (url, options) {
        this.emit(Evt.BEFORE_REQUEST);
        return net.http.getJSON.call(this, url, options);
    }

    verifyResource (url) {
        let endpoint = url || this.options.url;
        if (!endpoint) {
            throw new Error('No URL set for collection!');
        }
        return endpoint;
    }

    fetch (options = {}) {
        let response = this.request(this.verifyResource(options.url), options).then((response) => {
            this.parse(response.data);
        }, this.onParseFailed.bind(this), 'collection.fetch');
        return response;
    }

    get (index) {
        return this.models[index];
    }

    save (options = {}) {
        console.log('SAVE:', options);
    }

    /*post (options = {}) {
     options.method = 'POST';
     console.log('POST:', options);
     }

     put (options = {}) {
     options.method = 'PUT';
     console.log('PUT:', options);
     }

     del (options = {}) {
     options.method = 'DELETE';
     console.log('DEL:', options);
     }*/

    onParseFailed (e) {
        console.error('Parsing Failed.', e);
        return false;
    }
}

Collection.modelClass = Model;

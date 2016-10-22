/**
 * Defines an ES6 Set -like key/value store
 * Not yet evaluated for performance vs native implementation
 *
 * For your health!
 * @type {{has: *}}
 */
const LookupTable = {
    isEmpty: function () {
        return this.size() === 0;
    },

    add: function (name, value) {
        if (value === undefined) return false;

        if (this[name] === undefined) { // because 0, false and null are OK!
            this[name] = value;
            return true;
        } else {
            throw new Error('`' + name + '` already exists in lookup table.');
        }
    },
    remove: function (name) {
        if (this[name] !== undefined) {
            delete this[name];
            return true;
        } else {
            throw new ReferenceError('`' + name + '` does not exist in lookup table.');
        }

    },
    all: function () {
        let p,
            values = {};
        for (p in this) {
            if (this.has(p)) {
                values[p] = this[p];
            }
        }
        return values;
    },
    toArray: function () {
        let p,
            values = [];
        for (p in this) {
            if (this.has(p)) {
                values.push({key: p, value: this[p]});
            }
        }
        return values;
    },
    reset: function () {
        for (var x in this) if (this.hasOwnProperty(x) && typeof x !== 'function') delete this[x];
        return true;
    }
};

Object.defineProperty(LookupTable, 'has', {
    value: Object.prototype.hasOwnProperty,
    enumerable: false,
    writable: false
});

Object.defineProperty(LookupTable, 'size', {
    value: function () {
        return Object.keys(this.all()).length;
    },
    enumerable: false,
    writable: false
});

Object.defineProperty(LookupTable, 'length', {
    get: function () {
        return this.size();
    }
});

export default LookupTable;

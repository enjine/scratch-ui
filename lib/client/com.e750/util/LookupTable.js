/**
 * For your health!
 * @type {{has: *}}
 */
const LookupTable = {
	has: Object.prototype.hasOwnProperty,
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
	}
};
Object.defineProperty(LookupTable, 'size', {value: 0, enumerable: false});
Object.defineProperty(LookupTable, 'has', {value: Object.prototype.hasOwnProperty, enumerable: false});

export default LookupTable;

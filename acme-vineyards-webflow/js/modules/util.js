export function mixin(destObject) {
	var props = Object.keys(this.prototype);
	console.log('attempting mixin', props);
	for (var i = 0; i < props.length; i++) {
		if (typeof destObject === 'function') {
			destObject.prototype[props[i]] = this.prototype[props[i]];
		} else {
			destObject[props[i]] = this.prototype[props[i]];
		}
	}
	return destObject;
}

export default {mixin}
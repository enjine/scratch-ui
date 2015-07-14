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

export function handleDOMEvents(subscriptionType, object, eventNames, handler) {
	console.log('handleDOM', this, arguments);
	var i = 0,
		events = eventNames.split(' '),
		prefix = object.addEventListener ? '' : 'on';

	for (i; i < events.length; i += 1) {
		object[subscriptionType](prefix + events[i], handler, false);
	}
}

//Returns true if it is a DOM node
export function isNode(o){
  return (
    typeof Node === "object" ? o instanceof Node :
    o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
  );
}

//Returns true if it is a DOM element
export function isElement(o){
  return (
    typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
    o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
);
}

export default {mixin, handleDOMEvents, isNode, isElement}
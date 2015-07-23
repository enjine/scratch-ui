export function mixin(destObject) {
	var props = Object.keys(this.prototype);
	for (var i = 0; i < props.length; i++) {
		if (typeof destObject === 'function') {
			destObject.prototype[props[i]] = this.prototype[props[i]];
		} else {
			destObject[props[i]] = this.prototype[props[i]];
		}
	}
	return destObject;
}

export function bindDOMEvents(bindType, object, eventNames, handler) {
	var i = 0,
		events = eventNames.split(' '),
		prefix = object.addEventListener ? '' : 'on';

	for (i; i < events.length; i += 1) {
		object[bindType](prefix + events[i], handler, false);
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

export function isNativeEvent(eventname) {
    return typeof document.body["on" + eventname] !== "undefined";
}

export function htmlToDom(HTMLString) {
		let tmp = document.createElement("div");
		tmp.innerHTML = HTMLString;
		return tmp.firstElementChild;
	}

export default {mixin, bindDOMEvents, isNativeEvent, isNode, isElement, htmlToDom}
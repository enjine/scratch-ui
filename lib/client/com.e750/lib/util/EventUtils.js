import guid from '../util/Guid';

/**
 * Cross-Browser event listener.
 *
 * @param addOrRemove {String}
 * @param object {DOM Element or Node}
 * @param eventNames {String: list of events to listen for}
 * @param handler {Function}
 * @param useCapture {Boolean}
 */
export function manageNativeEvents (addOrRemove, object, eventNames, handler, useCapture = false) {
	var i = 0,
		events = eventNames.split(' '),
		prefix = object.addEventListener ? '' : 'on';

	try {
		return events.map(() => {
			let e = prefix + events[i],
				listenerId,
				addlistenerMethods = ['addEventListener', 'attachEvent'],
				ret;

			if (addlistenerMethods.indexOf(addOrRemove) !== -1) {
				listenerId = guid();
				handler.sId = listenerId;
			} else {
				console.log('Removing DOM event:', e, handler);
				delete handler.sId;
			}
			object[addOrRemove](e, handler, useCapture);
			ret = {evt: e, id: listenerId, fn: handler};
			return ret;
		});
	} catch (e) {
		console.error('Error attaching event listener', e, addOrRemove, object, eventNames, handler);
		return false;
	}

}

/**
 * Determines if event is browser/device-native as opposed to a custom event
 * @param eventname
 * @returns {boolean}
 */
export function isNativeEvent (eventname) {
	return typeof document.body['on' + eventname] !== 'undefined';
}

/**
 * Cross-browser addEventListener()
 * @param object
 * @param eventNames
 * @param handler
 */
export function addHandler (object, eventNames, handler) {
	let bindType = object.addEventListener ? 'addEventListener' : 'attachEvent';
	return manageNativeEvents(bindType, object, eventNames, handler);
}

/**
 * Cross-browser removeEventListener()
 * @param object
 * @param eventNames
 * @param handler
 */
export function removeHandler (object, eventNames, handler) {
	let bindType = object.removeEventListener ? 'removeEventListener' : 'detachEvent';
	return manageNativeEvents(bindType, object, eventNames, handler);
}

export default {isNativeEvent, addHandler, removeHandler};


import guid from '../util/Guid';

/**
 * Cross-Browser event listener.
 *
 * @param addOrRemove {String}
 * @param obj {DOM Element or Node}
 * @param eventNames {String: list of events to listen for}
 * @param handler {Function}
 * @param useCapture {Boolean}
 */
export function manageNativeEvents (addOrRemove, obj, eventNames, handler, useCapture = false) {
    var i = 0,
        events = eventNames.split(' '),
        prefix = obj.addEventListener ? '' : 'on';

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
                //console.log('Removing DOM event:', e, handler);
                delete handler.sId;
            }
            obj[addOrRemove](e, handler, useCapture);
            ret = {evt: e, id: listenerId, fn: handler};
            return ret;
        });
    } catch (e) {
        console.error('Error attaching event listener', e, addOrRemove, obj, eventNames, handler);
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
 * @param target
 * @param eventNames
 * @param handler
 */
export function addHandler (target, eventNames, handler) {
    let bindType = target.addEventListener ? 'addEventListener' : 'attachEvent';
    return manageNativeEvents(bindType, target, eventNames, handler);
}

/**
 * Cross-browser removeEventListener()
 * @param target
 * @param eventNames
 * @param handler
 */
export function removeHandler (target, eventNames, handler) {
    let bindType = target.removeEventListener ? 'removeEventListener' : 'detachEvent';
    return manageNativeEvents(bindType, target, eventNames, handler);
}

export default {isNativeEvent, addHandler, removeHandler};


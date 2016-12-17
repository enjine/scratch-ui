import guid from 'lib/util/guid';
import {isElement} from 'lib/util/DOM';

/**
 * Cross-Browser event listener.
 *
 * @param addOrRemove {String}
 * @param obj {DOM Element or Node}
 * @param event {String: event to listen for}
 * @param handler {Function}
 * @param useCapture {Boolean}
 */
export function manageNativeEvents (addOrRemove, obj, event, handler, useCapture = false) {
    var prefix = obj.addEventListener ? '' : 'on';

    try {
        let e = prefix + event,
            listenerId,
            addlistenerMethods = ['addEventListener', 'attachEvent'];

        if (addlistenerMethods.indexOf(addOrRemove) !== -1) {
            listenerId = guid();
            handler.sId = listenerId;
        } else {
            listenerId = handler.sId;
            delete handler.sId;
        }
        obj[addOrRemove](e, handler, useCapture);
        return {ev: e, id: listenerId, fn: handler};
    } catch (e) {
        console.error('Error on ' + addOrRemove + ': ', e, obj, event, handler);
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
    let bindType = target.addEventListener ? 'addEventListener' : 'attachEvent',
        isDOMEl = isElement(target),
        events = eventNames.split(' ');

    return events.map((event) => {
        let ev = event.trim();
        if (isDOMEl && isNativeEvent(ev)) {
            return manageNativeEvents(bindType, target, ev, handler);
        }
        return {ev: ev, id: null, fn: handler};
    });
}

/**
 * Cross-browser removeEventListener()
 * @param target
 * @param eventNames
 * @param handler
 */
export function removeHandler (target, eventNames, handler) {
    let bindType = target.removeEventListener ? 'removeEventListener' : 'detachEvent',
        isDOMEl = isElement(target),
        events = eventNames.split(' ');

    return events.map((event) => {
        let ev = event.trim();
        if (isDOMEl && isNativeEvent(ev)) {
            return manageNativeEvents(bindType, target, event, handler);
        }
        return {ev: event, id: null, fn: handler};
    });
}
/**
 * Parses a space separated event string into an array of event names
 * @param eventStr
 */
export function parseEventStr (eventStr) {
    const eventSplitter = /\s+/;
    let parts = eventStr.split(eventSplitter),
        event = parts[0],
        selector = parts[1];

    return {
        event: event,
        delegateTarget: selector
    };
}

export function getEventPath (event) {
    let path = [event.target],
        i = 0,
        x;
    while ((x = path[i].parentElement) !== null) {
        path.push(x);
        i++;
    }
    return path;
}

export function eventPathContains (event, selector) {
    let isInPath = getEventPath(event).map(el => {
        return el.tagName === selector.toUpperCase();
    });
    return isInPath.indexOf(true) !== -1;
}

export const isBindable = func => func.hasOwnProperty('prototype');

export default {isNativeEvent, addHandler, removeHandler, parseEventStr, getEventPath, eventPathContains, isBindable};


import Dispatcher from 'lib/event/Dispatcher';
import {isNativeEvent as isNative, addHandler, removeHandler} from 'lib/event/utils';
import {isElement, isNode, elementMatches} from 'lib/util/DOM';
import guid from 'lib/util/guid';
import nEvent from 'lib/event/nEvent';


export default function Evented () {
};

Object.assign(Evented.prototype, {
    /**
     * Delegate an event handler to child elements matching the selector
     *
     * @param evTarget
     * @param eventNames
     * @param handler
     * @param context
     * @returns {delegate}
     */
    delegate: function (evTarget, eventNames, handler, context) {
        let ctx = context || this;
        this.on(eventNames, function (e) {
            let target = e.target || e.srcElement;
            if (target && elementMatches(target, evTarget)) {
                return handler.apply(ctx, arguments);
            }
            return false;
        });
        return this;

    },

    /**
     * Delegate an event handler to child elements matching the selector
     * and remove the event listener after the callback is invoked
     *
     * @param evTarget
     * @param eventNames
     * @param handler
     * @param context
     * @returns {delegateOnce}
     */
    delegateOnce: function (evTarget, eventNames, handler, context) {
        let ctx = context || this;
        this.once(eventNames, function (e) {
            let target = e.target || e.srcElement;
            if (target && elementMatches(target, evTarget)) {
                return handler.apply(ctx, arguments);
            }
            return false;
        });
        return this;
    },

    /**
     * Inversion of control, a.k.a `delegate` for objects.
     * Enables event delegation on objects rather than DOM elements.
     * @param obj
     * @param event
     * @param handler
     * @param context
     * @returns {*}
     */
    listenTo: function (obj, event, handler, context) {
        let ctx = context || this;
        return this.on(event, function (e) {
            let target = e.target || e.srcElement;
            if (target && target === obj) {
                return handler.apply(ctx, arguments);
            }
            return false;
        });
    },

    /**
     * Inversion of control, a.k.a `delegate` for objects.
     * Enables event delegation on objects rather than DOM elements.
     * Removes the listener after it is invoked once.
     *
     * @param obj
     * @param event
     * @param handler
     * @param context
     * @returns {*}
     */
    listenToOnce: function (obj, event, handler, context) {
        let ctx = context || this;
        return this.once(event, function (e) {
            let target = e.target || e.srcElement;
            if (target && target === obj) {
                return handler.apply(ctx, arguments);
            }
            return false;
        });
    },

    /**
     * Adds and event listener to a DOM node or a subscription to anything else
     *
     * @param eventNames
     * @param handler
     * @param context
     * @returns {*}
     */
    on: function (eventNames, handler, context) {
        let delegate = this.el || this,
            ctx = context || this;

        return addHandler(delegate, eventNames, handler).reduce((ret, result) => {
            if (!result.id) {
                return ret.concat(this.subscribe(result.ev, result.fn));
            }
            return ret.concat(result);
        }, []);
    },

    /**
     * Removes an event listener or subscription
     *
     * @param eventNames
     * @param handler
     * @returns {*}
     */
    off: function (eventNames, handler) {
        let delegate = this.el || this;

        return removeHandler(delegate, eventNames, handler).reduce((ret, result) => {
            if (!result.id) {
                return ret.concat(this.unsubscribe(result.ev, result.fn));
            }
            return ret.concat(result);
        }, []);
    },

    /**
     * Adds an event listener whose callback will only be invoked once
     * @param event
     * @param handler
     * @param context
     * @returns {*}
     */
    once: function (event, handler, context) {
        let that = this,
            ctx = context || this;

        function cb () {
            that.off(event, cb);
            return handler.apply(ctx, arguments);
        }

        cb.sId = guid();
        let subscription = this.on(event, cb);
        return subscription;
    },

    /**
     * Triggers DOM Events
     * @param eventName
     * @param element
     * @param data
     * @returns {*|boolean}
     */
    trigger: function (eventName, element, data) {
        let E;
        if (!isNative(eventName) && CustomEvent in window) {
            E = CustomEvent(eventName, data);
            return element.dispatchEvent(E);
        }
        E = new Event(eventName);
        return element.dispatchEvent(E);
    },

    /**
     * Emits custom Events
     * @param eventName
     * @param data
     * @param args
     * @returns {*}
     */
    emit: function (eventName, data, ...args) {
        let el = this.el,
            elIsDOM = isElement(el) || isNode(el),
            native = isNative(eventName),
            subscribers = this.mediator.subscribers;

        if (native && elIsDOM) {
            return this.trigger(eventName, el);
        }

        if (subscribers.has(eventName)) {
            let payload = new nEvent(eventName, data, this);
            return this.mediator.dispatch(eventName, payload, args);

        }

        return false;
    },

    /**
     * Adds a pub/sub event handler
     *
     * @param channel
     * @param handler
     * @returns {Array}
     */
    subscribe: function (channel, handler) {
        let subscription = null,
            channels = channel.split(' ');

        return channels.map((ch) => {
            try {
                let c = ch.trim();
                subscription = this.mediator.add(c, handler);
                if (typeof this.subscriptions === 'undefined') {
                    this.subscriptions = [];
                }
                this.subscriptions.push(subscription);
                return subscription;
            } catch (e) {
                console.error('Failed to subscribe to channel ' + ch, e);
            }
            return false;
        });

    },

    /**
     * Removes a pub/sub event handler
     * @param channel
     * @param handler
     * @returns {*}
     */
    unsubscribe: function (channel, handler) {
        let ret,
            channels = channel.split(' ');
        try {
            channels.forEach((ch) => {
                let c = ch.trim();
                ret = this.subscriptions.filter((sub) => {
                    return sub.ev === c && this.mediator.subscribers[sub.ev][sub.id] === handler;
                }).map((hit) => {
                    let id = hit.id;
                    delete this.subscriptions[id];
                    return this.mediator.remove(channel, id);
                });
            });
        } catch (e) {
            console.error('Failed to unsubscribe from channel ' + channel, e);
        }
        return ret;
    }
});

Evented.prototype.mediator = Dispatcher();

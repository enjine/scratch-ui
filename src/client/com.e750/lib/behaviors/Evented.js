import Dispatcher from 'lib/event/Dispatcher';
import {isNativeEvent as isNative, addHandler, removeHandler} from 'lib/event/utils';
import {isElement, isNode} from 'lib/util/DOMUtils';
import guid from 'lib/util/Guid';
import nEvent from 'lib/event/nEvent';


export default function Evented () {
};

Object.assign(Evented.prototype, {
    delegate: function (evTarget, eventNames, handler, context) {
        let ctx = context || this;
        this.on(eventNames, function (e) {
            if (e.target && e.target.matches(evTarget)) {
                return handler.apply(ctx, arguments);
            }
            return false;
        });
        return this;

    },

    delegateOnce: function (evTarget, eventNames, handler, context) {
        let ctx = context || this;
        this.once(eventNames, function (e) {
            if (e.target && e.target.matches(evTarget)) {
                return handler.apply(ctx, arguments);
            }
            return false;
        });
        return this;
    },

    listenTo: function (obj, event, handler, context) {
        let ctx = context || this;
        this.on(event, function (e) {
            if (e.target && e.target === obj) {
                return handler.apply(ctx, arguments);
            }
            return false;
        });
        return this;
    },

    listenToOnce: function (obj, event, handler, context) {
        let ctx = context || this;
        this.once(event, function (e) {
            if (e.target && e.target === obj) {
                return handler.apply(ctx, arguments);
            }
            return false;
        });
        return this;
    },

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

    off: function (eventNames, handler) {
        let delegate = this.el || this;

        return removeHandler(delegate, eventNames, handler).reduce((ret, result) => {
            if (!result.id) {
                return ret.concat(this.unsubscribe(result.ev, result.fn));
            }
            return ret.concat(result);
        }, []);
    },

    once: function (event, handler, context) {
        let that = this,
            ctx = context || this;

        function cb () {
            handler.apply(ctx, arguments);
            return that.off(event, cb);
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

    unsubscribe: function (channel, handler) {
        let ret,
            channels = channel.split(' ');
        try {
            channels.forEach((ch) => {
                let c = ch.trim();
                ret = this.subscriptions.filter((sub) => {
                    return sub.ev === c && handler.sId === sub.id;
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

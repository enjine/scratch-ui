import Dispatcher from '../event/Dispatcher';
import {isNativeEvent as isNative, addHandler, removeHandler} from '../util/EventUtils';
import {isElement, isNode} from '../util/DOMUtils';
import guid from '../util/Guid';
import nEvent from '../event/nEvent';


export default function Evented () {
};

Object.assign(Evented.prototype, {
    on: function (event, handler, delegate) {
        let d = delegate || this.el || this;
        if (isNative(event)) {
            //console.log('adding native event', this, d, event, handler)
            return addHandler(d, event, handler);
        }

        return this.subscribe(event, handler, d);
    },

    off: function (event, handler, delegate) {
        if (isNative(event)) {
            let d = delegate || this.el || this;
            return removeHandler(d, event, handler);
        }
        return this.unsubscribe(event, handler);
    },

    once: function (event, handler, delegate) {
        let that = this;

        function on (data, args) {
            //console.log('ONCE called:', subscription, handler);
            that.off(event, on, delegate);
            handler(data, args);
        }

        on.sId = guid();
        //console.log('attaching ONCE:', subscription, handler);
        let subscription = this.on(event, on, delegate);
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
        let E,
            el = this.el,
            elIsDOM = isElement(el) || isNode(el),
            native = isNative(eventName),
            subscribers = this.mediator.subscribers;

        if (native && elIsDOM) {
            return this.trigger(eventName, el);
        }

        if (subscribers.has(eventName)) {
            //console.log('PUBSUB');
            let payload = new nEvent(eventName, data, this);
            return this.mediator.dispatch(eventName, payload, args);

        }

        return false;
    },

    subscribe: function (channel, handler, context) {
        let ctx = context,
            subscription = null;
        if (typeof context === 'undefined') {
            ctx = this;
        }

        try {
            subscription = this.mediator.add(channel, handler, ctx);
            if (typeof this.subscriptions === 'undefined') {
                this.subscriptions = [];
            }
            this.subscriptions.push(subscription);
            //console.log('!! subscribed', typeof this, this, this.subscriptions);
        } catch (e) {
            console.error('Failed to subscribe to channel ' + channel, e);
        }
        return subscription;

    },

    unsubscribe: function (channel, handler) {
        let ret = [];
        try {
            ret = this.subscriptions.filter((sub) => {
                //console.log('unsub:', channel, handler, sub.id);
                return sub.evt === channel && handler.sId === sub.id;
            }).map((hit) => {
                let id = hit.id;
                ret = this.mediator.remove(channel, id);
                this.subscriptions.splice(id, 1);
            });
        } catch (e) {
            console.error('Failed to unsubscribe from channel ' + channel, e);
        }
        return ret;
    }
});

Evented.prototype.mediator = Dispatcher();

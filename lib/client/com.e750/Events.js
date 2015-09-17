import Dispatcher from './event/Dispatcher';
import Events from './util/EventUtils';
import {isElement} from './util/DOMUtils';
import * as Util from './util/defaults';

const isNative = Events.isNativeEvent;
const addHandler = Events.addHandler;
const removeHandler = Events.removeHandler;
const guid = Util.guid;

function nEvent (type = '', data = {}, target = null) {
	this.type = type;
	this.data = data;
	this.target = target;
	this.cancelled = false;
}


var EventsAPI = {
	mediator: Dispatcher(),

	on: function (event, handler, delegate) {
		let d = delegate || this.el || this;
		if (isNative(event)) {
			//console.log(delegate, this.el, this);
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

		function helper (data) {
			//console.log('ONCE called:', subscription, handler);
			that.off(event, helper, delegate);
			handler(data);
		}

		helper.sId = guid();
		//console.log('attaching ONCE:', subscription, handler);
		let subscription = this.on(event, helper, delegate);
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
			el = this.el, //bad. el should be being passed in, then -> el.dispatchEvent; yey, not this.el, barf;
			elIsEl = isElement(el),
			native = isNative(eventName),
			subscribers = this.mediator.subscribers;

		//TODO: fix implementation to use trigger for DOM and emit for custom
		if (native && elIsEl) {
			E = new Event(eventName);
			return el.dispatchEvent(E);
		}

		if (subscribers.has(eventName)) {
			//console.log('PUBSUB');
			let payload = new nEvent(eventName, data, this);
			return this.mediator.dispatch(eventName, payload, args);

		}

		return false;
	},

	subscribe: function subscribe (channel, handler, context) {
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

	unsubscribe: function unsubscribe (channel, handler) {
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
};


export default {nEvent, EventsAPI};

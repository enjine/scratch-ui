import 'core-js';
import {mixin, bindDOMEvents, isNativeEvent, isNode, isElement, guid} from './Util';


export function nEvent (type = '', data = {}, target = null) {
	this.type = type;
	this.data = data;
	this.target = target;
	this.cancelled = false;
}


export function EventBoss () {
	this.events = {};
}

Object.assign(EventBoss.prototype, {

	findOrCreate: function (obj, eventName) {
		let events = this.events,
			id = obj.listenerId;

		if (!id) {
			console.warn('No ListenerId for: ' + obj.constructor.name, obj)
		}

		if (!events[id]) {
			console.log('1. adding new event list for: ' + id);
			events[id] = [];
		}

		if (!events[id][eventName]) {
			console.log('2. adding new handler array for:' + id + ': ' + eventName);
			events[id][eventName] = [];
		}

		events = events[id];

		return events;
	},

	addDOMEvent: function (object, eventNames, handler) {
		let bindType = object.addEventListener ? 'addEventListener' : 'attachEvent';
		//console.info('binding DOM Event: ', eventNames)
		bindDOMEvents(bindType, object, eventNames, handler);
	},

	removeDOMEvent: function (object, eventNames, handler) {
		let bindType = object.removeEventListener ? 'removeEventListener' : 'detachEvent';
		bindDOMEvents(bindType, object, eventNames, handler);
	},

	dispatch: function (obj, evt, data, ...args) {
		let subscriptions, i = 0, event, eventType, self = this;

		if (typeof evt === 'string') {
			event = this.createEvent(evt);
		}


		event.target = obj;
		event.data = {payload: data, args: args} || {};
		eventType = event.type;
		subscriptions = obj ? this.findOrCreate(obj, eventType) : this.findOrCreate(eventType);


		if (data && data.debug === true) {
			console.log('Dispatching Event: ', 'from:', obj.constructor.name + ':' + obj.listenerId, 'event:', eventType + ':', 'payload:', data, 'args:', args);
		}
		//console.log('subscriptions', subscriptions);

		function removeOnceHandler (handler, j) {
			if (data && data.debug === true) {
				console.log('removing once subscription for `' + this.constructor.name + ':' + this.listenerId + '`:', eventType, obj.eventsOnce[eventType][j]);
			}
			self.unsubscribe(this, eventType, handler);
			obj.eventsOnce[eventType].splice(j, 1);
		}

		for (i; i < subscriptions.length; i += 1) {
			if (data && data.debug === true) {
				console.log('Handling event: ', subscriptions[i].constructor.name + ':' + subscriptions[i].listenerId, eventType, 'data:', data);
			}
			//console.log('calling handler: ', i, subscriptions, 'event:', event, 'once', this.once[eventType]);
			//console.log('calling handler: ',  subscriptions[i].constructor.name);
			try {
				subscriptions[i](event);
				if (obj.eventsOnce[eventType]) {
					obj.eventsOnce[eventType].forEach(removeOnceHandler.bind(obj));
				}
			} catch (e) {
				throw e;
			}
		}
	},

	subscribe: function (obj, eventType, handler) {
		let subscriptions,
			isNewSubscription = false;
		if (!obj) {
			subscriptions = this.findOrCreate(eventType);
		} else {
			subscriptions = this.findOrCreate(obj, eventType);
		}

		if (subscriptions.findIndex((item) => {
				return item === handler;
			}) === -1) {
			subscriptions.push(handler);
			isNewSubscription = true;
		}

		console.log('subscribe:', obj, eventType, handler);
		return isNewSubscription;
	},

	unsubscribe: function (obj, eventType, handler) {
		let subscriptions, callbackIndex;

		try {
			if (!obj) {
				subscriptions = this.findOrCreate(eventType);
			} else {
				subscriptions = this.findOrCreate(obj, eventType);
			}
			callbackIndex = subscriptions.findIndex((item) => {
				console.log('+++', item)
				console.log('|||', handler)
				return item === handler;
			});
			console.log('mediator attempting unsubscribe >> ', callbackIndex, eventType, handler);
			if (callbackIndex !== -1) {
				console.log('unsubscribed!', obj.listenerId);
				subscriptions.splice(callbackIndex, 1);
			}
		} catch (e) {
			console.log(e);
			throw e;
		}
	},

	createEvent: function (type) {
		return new nEvent(type);
	},

	getTarget: function (evt) {
		let e = evt || window.event,
			target = e.target || e.srcElement || e.touches[0].target;
		return target;
	},

	preventDefault: function (event) {
		if (event.preventDefault) {
			event.preventDefault();
		} else {
			event.cancelled = true;
		}
	},

	stopPropagation: function (event) {
		if (event.stopPropagation) {
			event.stopPropagation();
			if (event.stopImmediatePropagation) {
				event.stopImmediatePropagation();
			}
		} else {
			event.cancelBubble = true;
		}
	}

});

export var PubSub = function (obj) {
	if (obj) return PubSub.mixin(obj);
};

PubSub.mixin = mixin;

Object.assign(PubSub.prototype, {
	mediator: new EventBoss(),

	/**
	 * for publishing broadcast messages
	 * @param event
	 * @param data
	 * @param args
	 * @returns {publish}
	 */
	publish: function (event, data, ...args) {
		this.mediator.dispatch(this, event, data, args);
		return this;
	},

	/**
	 * for receiving broadcast messages
	 * @param event
	 * @param handler
	 */
	subscribe: function (event, handler) {
		this.mediator.subscribe(this, event, handler);
	},


	unsubscribe: function (event, handler) {
		console.log('unsubscribing >> ', this.constructor.name, event);
		this.mediator.unsubscribe(this, event, handler);
	}
});

export function Emitter (obj) {
	if (obj) return Emitter.mixin(obj);
}

Emitter.mixin = mixin;
Emitter.createDelegate = function () {
	var delegate, event, handler;
	if (isNode(arguments[0]) && isElement(arguments[0])) {
		delegate = arguments[0];
		event = arguments[1];
		handler = arguments[2];
	} else {
		delegate = this.el;
		event = arguments[0];
		handler = arguments[1];
	}
	//console.log('createDelegate', this, arguments, arguments.length, isNode(arguments[0]), isElement(arguments[0]), [delegate, event, handler]);
	return [delegate, event, handler];
};

Object.assign(Emitter.prototype, PubSub.prototype, {

	/**
	 * for SINGLE event (non broadcast)
	 * @param delegate
	 * @param event
	 * @param handler
	 * @returns {on}
	 */
	on: function () {
		let [delegate, event, handler] = Emitter.createDelegate.apply(this, arguments);
		if (isNativeEvent(event)) {
			this.mediator.addDOMEvent(delegate, event, handler);
		} else {
			this.subscribe(event, handler);
		}

		//console.log("registering ON event handler:", this, delegate, event, handler);
		return this;
	},

	once: function () {
		let [delegate, event, handler] = Emitter.createDelegate.apply(this, arguments);
		let self = this;

		function callbackNative (...data){
			self.off(delegate, event, handler);
			return handler(data);
		}

		function callbackPubSub (...data){
			self.unsubscribe(event, handler);
			return handler(data);
		}

		if (isNativeEvent(event)) {
			console.log('once:', this);
			this.on(delegate, event, callbackNative);
		} else {
			if (!this.eventsOnce[event]) {
				this.eventsOnce[event] = [];
			}
			this.eventsOnce[event].push(callbackPubSub);
			this.subscribe(event, callbackPubSub);
			console.log('subscribeOnce:', this.eventsOnce[event]);
		}

		return this;
	},

	off: function () {
		let [delegate, event, handler] = Emitter.createDelegate.apply(this, arguments);
		this.mediator.removeDOMEvent(delegate, event, handler);
		console.log('removing DOM event handler for `' + event + '`:', this, delegate, handler);
		return this;
	},

	trigger: function (event, data, ...args) {
		return this.emit(event, data, args);
	},

	emit: function (event, data, ...args) {
		//console.log(this.constructor.name, "EMITTED:", event, data, ...args);
		if (isNativeEvent(event)) {
			this.el.dispatchEvent(new Event(event));
		} else {
			this.publish(event, data, args);
		}
		return this;
	}
});

export var Listener = function (obj) {
	if (obj) return Listener.mixin(obj);
}; //aka observer...

Listener.mixin = mixin;

/*Object.assign(Listener.prototype, {
 listenTo: function (object, event, handler, context, options) {

 },

 stopListening: function (object, event) {

 }
 });*/


export var Evented = function () {
};
Object.assign(Evented, Emitter.prototype, Listener.prototype);

export default {Emitter, Listener};

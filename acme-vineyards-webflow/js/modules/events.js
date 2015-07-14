import {mixin, handleDOMEvents, isNode, isElement} from './util';


export function nEvent(type = '', data = {}, target = null) {
	this.type = type;
	this.data = data;
	this.target = target;
	this.cancelled = false;
}


function EventBoss() {
	this.events = {};
}

Object.assign(EventBoss.prototype, {

	findOrCreate: function () {
		var events = this.events,
			evt;

		while (arguments.length > 0) {
			evt = Array.prototype.shift.call(arguments);
			if (!events[evt]) {
				events[evt] = [];
			}
			events = events[evt];
		}

		return events;
	},

	addEvent: function (object, eventNames, fn) {
		var subscriptionType = object.addEventListener ? 'addEventListener' : 'attachEvent';
		handleDOMEvents(subscriptionType, object, eventNames, fn);
	},

	removeEvent: function (object, eventNames, fn) {
		var subscriptionType = object.removeEventListener ? 'removeEventListener' : 'detachEvent';
		handleDOMEvents(subscriptionType, object, eventNames, fn);
	},

	dispatch: function (obj, event, data, options) {

		var subscriptions, i = 0, eventType;

		if (typeof event === 'string') {
			event = this.createEvent(event);
		}

		console.log('dispatch', event, obj, data, options);

		event.target = obj;
		event.data = data;
		eventType = event.type;
		subscriptions = obj ? this.findOrCreate(obj, eventType) : this.findOrCreate(eventType);

		console.log('subscriptions', subscriptions);


		for (i; i < subscriptions.length; i += 1) {
			console.log('dispatching event', subscriptions[i], event);
			try {
				subscriptions[i](event);
			} catch (e) {
				throw e;
			}

		}
	},

	subscribe: function (obj, eventType, callback) {

		var subscriptions,
			isNewSubscription = false;
		if (!obj) {
			subscriptions = this.findOrCreate(eventType);
		} else {
			subscriptions = this.findOrCreate(obj, eventType);
		}

		if (subscriptions.findIndex((item) => {return item === callback}) === -1) {
			subscriptions.push(callback);
			isNewSubscription = true;
		}

		console.log('subscribe:', obj, eventType, callback);
		return isNewSubscription;
	},

	unsubscribe: function (obj, eventType, callback) {
		var subscriptions, callbackIndex;

		if (!obj) {
			subscriptions = this.findOrCreate(eventType);
		} else {
			subscriptions = this.findOrCreate(obj, eventType);
		}
		callbackIndex = subscriptions.findIndex((item) => {
			return item === callback;
		});
		if (callbackIndex !== -1) {
			subscriptions.splice(callbackIndex, 1);
		}
	},

	createEvent: function (type) {
		var event = new nEvent(type);
		return event;
	},

	getTarget: function (evt) {
		var e = evt || window.event,
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

export function Emitter(obj) {
	if (obj) return Emitter.mixin(obj);
}
Emitter.mixin = mixin;
Emitter.createDelegate = function(){
	console.log('createDelegate', this, arguments, arguments.length, isNode(arguments[0]), isElement(arguments[0]));
	var delegate, event, handler;
	if(!isNode(arguments[0]) && !isElement(arguments[0])){
		delegate = this.el;
		event = arguments[0];
		handler = arguments[1];
	}else{
		delegate = arguments[0];
		event = arguments[1];
		handler = arguments[2];
	}
	return [delegate, event, handler];
};

Object.assign(Emitter.prototype, {
	mediator: new EventBoss(),

	/**
	 * for SINGLE events (non broadcast)
	 * @param delegate
	 * @param event
	 * @param handler
	 * @returns {on}
	 */
	on: function () {
		let [delegate, event, handler] = Emitter.createDelegate.apply(this, arguments);
		this.mediator.addEvent(delegate, event, handler);
		console.log("registering ON event handler:", this, delegate, event, handler);
		return this;
	},

	once: function (delegate, event, handler) {
		this.on(delegate, event, (data) => {
			this.off(delegate, event, handler);
			handler(data);
		});
		return this;
	},

	off: function (event, handler) {
		this._events = this._events || {};
		if (event in this._events === false)    return;
		this._events[event].splice(this._events[event].indexOf(handler), 1);
		return this;
	},

	emit: function (event, ...args) {
		console.log("EMITTTED EVENT:", this, ...args);
		this._events = this._events || {};
		if (event in this._events === false) return;
		for (var i = 0; i < this._events[event].length; i++) {
			console.log(event, ...args);
			this._events[event][i].call(this, ...args);
		}
		this.mediator.publish(event);
	}
});

export var Listener = function (obj) {
	if (obj) return Listener.mixin(obj);
}; //aka observer...

Listener.mixin = mixin;

Object.assign(Listener.prototype, {
	listenTo: function (object, event, handler, context, options) {

	},

	stopListening: function (object, event) {

	}
});


export var PubSub = function (obj) {
	if (obj) return PubSub.mixin(obj);
};

PubSub.mixin = mixin;

Object.assign(PubSub.prototype, {

	_once: {},

	/**
	 * for publishing broadcast messages
	 * @param event
	 * @param data
	 * @param options
	 * @returns {publish}
	 */
	publish: function (event, data, options) {
		this.mediator.dispatch(this, event, data, options);

		if(this._once[event]){
			this._once[event].forEach((i, handler) => {
				this.mediator.unsubscribe(this, event, handler);
			});

		}

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

	subscribeOnce: function (event, handler) {
		if(!this._once[event].length){
			this._once[event] = [];
		}
		this._once[event].push(handler);
		this.mediator.subscribe(this, event, handler);
	},

	unsubscribe: function (event) {
		this.mediator.unsubscribe(this, event, handler);
	}
});


export var All = function () {};
Object.assign(All, Emitter.prototype, Listener.prototype, PubSub.prototype);

export default {Emitter, Listener, PubSub}

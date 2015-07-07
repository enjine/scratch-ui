import {mixin} from './util';

export function Emitter(obj) {
	if (obj) return Emitter.mixin(obj);
}
Emitter.mixin = mixin;

Object.assign(Emitter.prototype, {
	on: function (event, handler) {
		this._events = this._events || {};
		(this._events[event] = this._events[event] || []).push(handler);
		console.log("registering ON event handler:", this, event, handler);
		return this;
	},

	once: function (event, handler) {
		this.on(event, (data) => {
			this.off(event, handler);
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

var Mediator = function (timestamp) {
	console.log("NEW MEDIATOR: ", timestamp);

	var subscribers = [],
		instances = [],
		eventMap = {};

	var evented = function (instance) {
		console.log('adding instance', instance)
		instances.push(instance);
	};

	evented.prototype = {
		/**
		 * Broadcasts an event of the given name.
		 * All instances that wish to receive a broadcast must implement the `receiveBroadcast` method, the event that is being broadcast will be passed to the implementation.
		 * @param {String} name Event name.
		 * @returns {undefined}
		 */
		broadcast: function (name) {
			instances.forEach(function (instance) {
				if(instance.hasOwnProperty("receiveBroadcast") && typeof instance["receiveBroadcast"] === "function"){
					instance["receiveBroadcast"](name);
				}
			});
		},
		/**
		 * Emits an event of the given name only to instances that are subscribed to it.
		 * @param {String} name Event name.
		 * @returns {undefined}
		 */
		emit: function (name) {
			if(eventMap.hasOwnProperty(name) && eventMap[name]){
				eventMap[name].forEach(function (subscription) {
					subscription.process.call(subscription.context);
				});
			}
		},
		/**
		 * Registers the given action as a listener to the named event.
		 * This method will first create an event identified by the given name if one does not exist already.
		 * @param {String} name Event name.
		 * @param {Function} action Listener.
		 * @returns {Function} A deregistration function for this listener.
		 */
		on: function (name, action) {
			if(!eventMap.hasOwnProperty(name)){
				eventMap[name] = []
			}

			eventMap[name].push({
				context: this,
				process: action
			});

			var subscriptionIndex = eventMap[name].length - 1;

			return function () {
				eventMap[name].splice(subscriptionIndex, 1);
			};
		},
		addSubscriber: function (obj, event, handler) {
			console.log("subscribed: ", obj, event, handler);
			if (!this.subscribers[obj]) {
				this.subscribers[obj][event] = [];
			}
			if (!this.subscribers[obj][event]) {
				this.subscribers[obj][event] = [];
			}
			this.subscribers[obj][event].push(handler);
			return this;
		},
		removeSubscriber: function (obj, event, handler) {
			if (this.subscribers[obj][event][handler]) {
				delete this.subscribers[obj][event][handler];
			}
		}

	};

	return evented;
};


export var PubSub = function (obj) {
	this.mediator = new Mediator(new Date());
	if (obj) return PubSub.mixin(obj);
};
PubSub.mixin = mixin;

Object.assign(PubSub.prototype, Mediator.prototype, {

	publish: function (channel, message, options) {
		this.mediator.broadcast(this, channel, message, options);
	},

	subscribe: function (channel, handler) {
		this.mediator.addSubscriber(this, event, handler);
	},

	subscribeOnce: function (channel, handler) {

	},

	unsubscribe: function (channel) {
		this.mediator.removeSubscriber(this, event, handler);
	}
});


export var All = function () {
};
Object.assign(All, Emitter.prototype, Listener.prototype, PubSub.prototype);

export default {Mediator, Emitter, Listener, PubSub}

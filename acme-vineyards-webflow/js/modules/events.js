export function Emitter() {}

Emitter.mixin = function (destObject) {
	var props = Object.keys(this.prototype);
	console.log('attempting mixin', props);
	for (var i = 0; i < props.length; i++) {
		if (typeof destObject === 'function') {
			destObject.prototype[props[i]] = this.prototype[props[i]];
		} else {
			destObject[props[i]] = this.prototype[props[i]];
		}
	}
	return destObject;
};

Object.assign(Emitter.prototype, {
	on: function (event, handler) {
		this._events = this._events || {};
		this._events[event] = this._events[event] || [];
		this._events[event].push(handler);
	},

	once: function (event, handler) {
		this.on(event, (data) => {
			handler(data);
			this.off(event, handler);
		});
	},

	off: function (event, handler) {
		this._events = this._events || {};
		if (event in this._events === false)    return;
		this._events[event].splice(this._events[event].indexOf(handler), 1);
	},

	emit: function (event, ...args) {
		console.log("EMITTTED EVENT:", this, ...args);
		this._events = this._events || {};
		if (event in this._events === false)    return;
		for (var i = 0; i < this._events[event].length; i++) {
			console.log(event, ...args);
			this._events[event][i].call(this, ...args);
		}
	}
});

export var Listener = function () {}; //aka observer...
Object.assign(Listener.prototype, {
	listenTo: function (object, event, handler, context, options) {

	},

	stopListening: function (object, event) {

	}
});

var PubSub = function () {};
Object.assign(PubSub.prototype, {
	publish: function (channel, message, options) {

	},

	subscribe: function (channel, options) {

	},

	unsubscribe: function (channel) {

	}
});

var Mediator = function () {
	var subscribers = [],
		eventMap = {};

	addSubscriber

};

Object.assign(Mediator.prototype, {});

export var All = function () {};
Object.assign(All, Emitter.prototype, Listener.prototype, PubSub.prototype);

export default {Mediator, Emitter, Listener, Broadcaster}
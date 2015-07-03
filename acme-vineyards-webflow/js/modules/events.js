var mixin = function (destObject) {
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

export function Emitter(obj) {
	if(obj) return Emitter.mixin(obj);
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
	if(obj) return Listener.mixin(obj);
}; //aka observer...
Listener.mixin = mixin;

Object.assign(Listener.prototype, {
	listenTo: function (object, event, handler, context, options) {

	},

	stopListening: function (object, event) {

	}
});

export var PubSub = function (obj) {
	if(obj) return PubSub.mixin(obj);
};
PubSub.mixin = mixin;

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

	function addSubscriber(event, handler){
		console.log("subscribed: ", event, handler);
		if(!subscribers[event]){
			subscribers[event] = [];
		}
		subscribers[event].push(handler);
		return this;
	}

};

Object.assign(Mediator.prototype, {});

export var All = function () {};
Object.assign(All, Emitter.prototype, Listener.prototype, PubSub.prototype);

export default {Mediator, Emitter, Listener, PubSub}

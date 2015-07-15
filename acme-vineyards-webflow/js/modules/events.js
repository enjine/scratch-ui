import {mixin, bindDOMEvents, isNativeEvent, isNode, isElement} from './util';


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
		let events = this.events,
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

	addDOMEvent: function (object, eventNames, handler) {
		let bindType = object.addEventListener ? 'addEventListener' : 'attachEvent';
		console.info('binding DOM Event: ', eventNames)
		bindDOMEvents(bindType, object, eventNames, handler);
	},

	removeDOMEvent: function (object, eventNames, handler) {
		let bindType = object.removeEventListener ? 'removeEventListener' : 'detachEvent';
		bindDOMEvents(bindType, object, eventNames, handler);
	},

	dispatch: function (obj, event, data, ...args) {
		let subscriptions, i = 0, eventType;

		if (typeof event === 'string') {
			event = this.createEvent(event);
		}

		console.log('Dispatching Event: ', event, obj, data, ...args);

		event.target = obj;
		event.data = {payload:data, args: [...args]} || {};
		eventType = event.type;
		subscriptions = obj ? this.findOrCreate(obj, eventType) : this.findOrCreate(eventType);

		console.log('subscriptions', subscriptions);


		for (i; i < subscriptions.length; i += 1) {
			console.log('calling subscriber: ', event, subscriptions[i]);
			try {
				subscriptions[i](event, ...args);
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

		if (subscriptions.findIndex((item) => {return item === handler}) === -1) {
			subscriptions.push(handler);
			isNewSubscription = true;
		}

		console.log('subscribe:', obj, eventType, handler);
		return isNewSubscription;
	},

	unsubscribe: function (obj, eventType, handler) {
		let subscriptions, callbackIndex;

		if (!obj) {
			subscriptions = this.findOrCreate(eventType);
		} else {
			subscriptions = this.findOrCreate(obj, eventType);
		}
		callbackIndex = subscriptions.findIndex((item) => {
			return item === handler;
		});
		if (callbackIndex !== -1) {
			subscriptions.splice(callbackIndex, 1);
		}
	},

	createEvent: function (type) {
		let event = new nEvent(type);
		return event;
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
	_once: {},

	/**
	 * for publishing broadcast messages
	 * @param event
	 * @param data
	 * @param options
	 * @returns {publish}
	 */
	publish: function (event, data, ...args) {
		this.mediator.dispatch(this, event, data, ...args);

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

export function Emitter(obj) {
	if (obj) return Emitter.mixin(obj);
}

Emitter.mixin = mixin;
Emitter.createDelegate = function(){
	var delegate, event, handler;
	if(isNode(arguments[0]) && isElement(arguments[0])){
		delegate = arguments[0];
		event = arguments[1];
		handler = arguments[2];
	}else{
		delegate = this.el;
		event = arguments[0];
		handler = arguments[1];
	}
	//console.log('createDelegate', this, arguments, arguments.length, isNode(arguments[0]), isElement(arguments[0]), [delegate, event, handler]);
	return [delegate, event, handler];
};

Object.assign(Emitter.prototype, PubSub.prototype, {

	/**
	 * for SINGLE events (non broadcast)
	 * @param delegate
	 * @param event
	 * @param handler
	 * @returns {on}
	 */
	on: function () {
		let [delegate, event, handler] = Emitter.createDelegate.apply(this, arguments);
		if(isNativeEvent(event)){
			this.mediator.addDOMEvent(delegate, event, handler);
		}else{
			this.subscribe(event, handler);
		}

		console.log("registering ON event handler:", this, delegate, event, handler);
		return this;
	},

	once: function () {
		let [delegate, event, handler] = Emitter.createDelegate.apply(this, arguments);
		this.on(delegate, event, (...data) => {
			this.off(delegate, event, handler);
			handler(...data);
		});
		return this;
	},

	off: function () {
		let [delegate, event, handler] = Emitter.createDelegate.apply(this, arguments);
		this.mediator.removeDOMEvent(delegate, event, handler);
		console.log("removing event handler:", this, delegate, event, handler);
		return this;
	},

	emit: function (event, data, ...args) {
		console.log("EMIT:", this, data, ...args);
		if(isNativeEvent(event)){
			this.el.dispatchEvent(new Event(event));
		}else{
			this.mediator.dispatch(this, event, data, ...args);
		}
		return this;
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


export var All = function () {};
Object.assign(All, Emitter.prototype, Listener.prototype, PubSub.prototype);

export default {Emitter, Listener, PubSub}

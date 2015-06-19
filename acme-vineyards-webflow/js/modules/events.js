var event = function (options = {}) {};
Object.assign(base.prototype, {
	on: function (event, handler, context, options) {

	},

	once: function (event, handler, context, options) {

	},

	off: function (event, handler) {

	},

	trigger: function (event, data, options) {

	},

	one: function (event, data, options) {

	}
});

var instance = function (options = {}) {};
Object.assign(instance.prototype, {
	listenTo: function (object, event, handler, context, options) {

	},

	stopListening: function (object, event) {

	}
});

var broadcast = function (options = {}) {};
Object.assign(broadcast.prototype, {
	publish: function (channel, message, options) {

	},

	subscribe: function (channel, options) {

	},

	unsubscribe: function (channel) {

	}
});

export var all = function(){};
Object.assign(all, instance.prototype, event.prototype, instance.prototype, broadcast.prototype);

export default {event, instance, broadcast}
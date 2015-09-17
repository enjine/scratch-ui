import 'core-js';
import RSVP from 'rsvp';
var xhttp = require('xhttp/custom')(RSVP.Promise);
//var xhttp = require('xhttp/custom')(Promise); // native ES6 Promise
import templeton from 'templeton';
import Evt from './Events';
import * as DOMUtils from './Util/DOMUtils';

const htmlToDom = DOMUtils.htmlToDom;
const Events = Evt.EventsAPI;

export var net = {
	http: {
		/**
		 * Base ASYNC request function
		 * returns an A+ promise
		 * @param options
		 * @returns {*}
		 */
		ajax: function (options) {
			let defaults = {
				method: 'GET'
			};

			Object.assign(defaults, options);
			Events.emit('beforeAsync', options);
			return xhttp(options);
		},
		/**
		 * Alias for an ASYNC HTTP GET
		 * returns an A+ promise
		 * @param options
		 * @returns {*}
		 */
		get: function (options) {
			options.method = 'GET';
			return this.ajax(options);
		}
	}
};

export var storage = {

	cookie: (name, value, options) => {

		function encode (val) {
			try {
				return encodeURIComponent(val);
			} catch (e) {
				return null;
			}
		}

		function decode (val) {
			try {
				return decodeURIComponent(val);
			} catch (e) {
				return null;
			}
		}

		function set (key, val) {
			let opts = arguments[2] === undefined ? {} : arguments[2];

			var str = '' + encode(key) + '=' + encode(val);

			if (val == null) options.maxage = -1;

			if (opts.maxage) {
				opts.expires = new Date(+new Date() + opts.maxage);
			}

			if (opts.path) str += '; path=' + opts.path;
			if (opts.domain) str += '; domain=' + opts.domain;
			if (opts.expires) str += '; expires=' + opts.expires.toUTCString();
			if (opts.secure) str += '; secure';

			document.cookie = str;
		}

		function get (key) {
			var cookies = parse(document.cookie);
			return !!key ? cookies[key] : cookies;
		}

		function parse (str) {
			var obj = {},
				pairs = str.split(/ *; */);

			if (!pairs[0]) {
				return obj;
			}
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;
			var _iterator, _step;

			try {
				for (_iterator = pairs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var pair = _step.value;

					pair = pair.split('=');
					obj[decode(pair[0])] = decode(pair[1]);
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			return obj;
		}

		if (arguments.length < 2) {
			console.log(name, value, options, document.cookie);
			return get(name);
		}

		set(name, value, options);
	}
};

export var jst = {
	templates: {},

	getFromDOM: (name) => {
		return document.getElementById(name).innerHTML;
	},

	compile: (templateStr, data, overrides) => {
		return htmlToDom(templeton.template(templateStr, data, overrides));
	}

};

export default {net, storage, jst};

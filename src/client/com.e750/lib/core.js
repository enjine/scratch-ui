import templeton from 'templeton';
import Evented from './behaviors/Evented';
import {htmlToDom} from './util/DOMUtils';
import Evt from './event/Registry';

require('whatwg-fetch');


export const net = {
    http: {
        /**
         * Base NET request function
         * returns an A+ promise
         * @param options
         * @returns {*}
         */
        exec: function (url, options) {
            function checkStatus (response) {
                if (response.status >= 200 && response.status < 300 || response === 0 /*local file*/) {
                    return response;
                } else {
                    return Promise.reject(new Error(response.statusText));
                }
            }

            function parseResponse (response) {
                var contentType = response.headers.get('content-type');
                if (contentType && contentType.indexOf('application/json') !== -1) {
                    return response.json();
                }
                return response.text();
            }

            this.emit(Evt.BEFORE_FETCH, options);
            return fetch(url, options).then(checkStatus).then(parseResponse);
        },
        /**
         * GET, POST, PUT, DELETE methods
         * @param String url
         * @param Object options
         * @returns native promises
         */
        get: function (url, options) {
            options.method = 'GET';
            return net.http.exec.call(this, url, options);
        },

        post: function (url, options) {
            options.method = 'POST';
            return net.http.exec.call(this, url, options);
        },

        put: function (url, options) {
            options.method = 'PUT';
            return net.http.exec.call(this, url, options);
        },

        del: function (url, options) {
            options.method = 'DELETE';
            return net.http.exec.call(this, url, options);
        }
    }
};

export const storage = {

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

            if (val === null) options.maxage = -1;

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
            return get(name);
        }

        set(name, value, options);
    }
};

export const jst = {
    templates: {},

    getFromDOM: (name) => {
        return document.getElementById(name).innerHTML;
    },

    compile: (templateStr, data, overrides) => {
        return htmlToDom(templeton.template(templateStr, data, overrides));
    }

};

export default {net, storage, jst};

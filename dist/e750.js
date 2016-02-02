(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (process,global){
/*!
 * @overview RSVP - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/tildeio/rsvp.js/master/LICENSE
 * @version   3.1.0
 */

(function() {
    "use strict";
    function lib$rsvp$utils$$objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'object' && x !== null);
    }

    function lib$rsvp$utils$$isFunction(x) {
      return typeof x === 'function';
    }

    function lib$rsvp$utils$$isMaybeThenable(x) {
      return typeof x === 'object' && x !== null;
    }

    var lib$rsvp$utils$$_isArray;
    if (!Array.isArray) {
      lib$rsvp$utils$$_isArray = function (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      lib$rsvp$utils$$_isArray = Array.isArray;
    }

    var lib$rsvp$utils$$isArray = lib$rsvp$utils$$_isArray;

    var lib$rsvp$utils$$now = Date.now || function() { return new Date().getTime(); };

    function lib$rsvp$utils$$F() { }

    var lib$rsvp$utils$$o_create = (Object.create || function (o) {
      if (arguments.length > 1) {
        throw new Error('Second argument not supported');
      }
      if (typeof o !== 'object') {
        throw new TypeError('Argument must be an object');
      }
      lib$rsvp$utils$$F.prototype = o;
      return new lib$rsvp$utils$$F();
    });
    function lib$rsvp$events$$indexOf(callbacks, callback) {
      for (var i=0, l=callbacks.length; i<l; i++) {
        if (callbacks[i] === callback) { return i; }
      }

      return -1;
    }

    function lib$rsvp$events$$callbacksFor(object) {
      var callbacks = object._promiseCallbacks;

      if (!callbacks) {
        callbacks = object._promiseCallbacks = {};
      }

      return callbacks;
    }

    var lib$rsvp$events$$default = {

      /**
        `RSVP.EventTarget.mixin` extends an object with EventTarget methods. For
        Example:

        ```javascript
        var object = {};

        RSVP.EventTarget.mixin(object);

        object.on('finished', function(event) {
          // handle event
        });

        object.trigger('finished', { detail: value });
        ```

        `EventTarget.mixin` also works with prototypes:

        ```javascript
        var Person = function() {};
        RSVP.EventTarget.mixin(Person.prototype);

        var yehuda = new Person();
        var tom = new Person();

        yehuda.on('poke', function(event) {
          console.log('Yehuda says OW');
        });

        tom.on('poke', function(event) {
          console.log('Tom says OW');
        });

        yehuda.trigger('poke');
        tom.trigger('poke');
        ```

        @method mixin
        @for RSVP.EventTarget
        @private
        @param {Object} object object to extend with EventTarget methods
      */
      'mixin': function(object) {
        object['on']      = this['on'];
        object['off']     = this['off'];
        object['trigger'] = this['trigger'];
        object._promiseCallbacks = undefined;
        return object;
      },

      /**
        Registers a callback to be executed when `eventName` is triggered

        ```javascript
        object.on('event', function(eventInfo){
          // handle the event
        });

        object.trigger('event');
        ```

        @method on
        @for RSVP.EventTarget
        @private
        @param {String} eventName name of the event to listen for
        @param {Function} callback function to be called when the event is triggered.
      */
      'on': function(eventName, callback) {
        if (typeof callback !== 'function') {
          throw new TypeError('Callback must be a function');
        }

        var allCallbacks = lib$rsvp$events$$callbacksFor(this), callbacks;

        callbacks = allCallbacks[eventName];

        if (!callbacks) {
          callbacks = allCallbacks[eventName] = [];
        }

        if (lib$rsvp$events$$indexOf(callbacks, callback) === -1) {
          callbacks.push(callback);
        }
      },

      /**
        You can use `off` to stop firing a particular callback for an event:

        ```javascript
        function doStuff() { // do stuff! }
        object.on('stuff', doStuff);

        object.trigger('stuff'); // doStuff will be called

        // Unregister ONLY the doStuff callback
        object.off('stuff', doStuff);
        object.trigger('stuff'); // doStuff will NOT be called
        ```

        If you don't pass a `callback` argument to `off`, ALL callbacks for the
        event will not be executed when the event fires. For example:

        ```javascript
        var callback1 = function(){};
        var callback2 = function(){};

        object.on('stuff', callback1);
        object.on('stuff', callback2);

        object.trigger('stuff'); // callback1 and callback2 will be executed.

        object.off('stuff');
        object.trigger('stuff'); // callback1 and callback2 will not be executed!
        ```

        @method off
        @for RSVP.EventTarget
        @private
        @param {String} eventName event to stop listening to
        @param {Function} callback optional argument. If given, only the function
        given will be removed from the event's callback queue. If no `callback`
        argument is given, all callbacks will be removed from the event's callback
        queue.
      */
      'off': function(eventName, callback) {
        var allCallbacks = lib$rsvp$events$$callbacksFor(this), callbacks, index;

        if (!callback) {
          allCallbacks[eventName] = [];
          return;
        }

        callbacks = allCallbacks[eventName];

        index = lib$rsvp$events$$indexOf(callbacks, callback);

        if (index !== -1) { callbacks.splice(index, 1); }
      },

      /**
        Use `trigger` to fire custom events. For example:

        ```javascript
        object.on('foo', function(){
          console.log('foo event happened!');
        });
        object.trigger('foo');
        // 'foo event happened!' logged to the console
        ```

        You can also pass a value as a second argument to `trigger` that will be
        passed as an argument to all event listeners for the event:

        ```javascript
        object.on('foo', function(value){
          console.log(value.name);
        });

        object.trigger('foo', { name: 'bar' });
        // 'bar' logged to the console
        ```

        @method trigger
        @for RSVP.EventTarget
        @private
        @param {String} eventName name of the event to be triggered
        @param {*} options optional value to be passed to any event handlers for
        the given `eventName`
      */
      'trigger': function(eventName, options, label) {
        var allCallbacks = lib$rsvp$events$$callbacksFor(this), callbacks, callback;

        if (callbacks = allCallbacks[eventName]) {
          // Don't cache the callbacks.length since it may grow
          for (var i=0; i<callbacks.length; i++) {
            callback = callbacks[i];

            callback(options, label);
          }
        }
      }
    };

    var lib$rsvp$config$$config = {
      instrument: false
    };

    lib$rsvp$events$$default['mixin'](lib$rsvp$config$$config);

    function lib$rsvp$config$$configure(name, value) {
      if (name === 'onerror') {
        // handle for legacy users that expect the actual
        // error to be passed to their function added via
        // `RSVP.configure('onerror', someFunctionHere);`
        lib$rsvp$config$$config['on']('error', value);
        return;
      }

      if (arguments.length === 2) {
        lib$rsvp$config$$config[name] = value;
      } else {
        return lib$rsvp$config$$config[name];
      }
    }

    var lib$rsvp$instrument$$queue = [];

    function lib$rsvp$instrument$$scheduleFlush() {
      setTimeout(function() {
        var entry;
        for (var i = 0; i < lib$rsvp$instrument$$queue.length; i++) {
          entry = lib$rsvp$instrument$$queue[i];

          var payload = entry.payload;

          payload.guid = payload.key + payload.id;
          payload.childGuid = payload.key + payload.childId;
          if (payload.error) {
            payload.stack = payload.error.stack;
          }

          lib$rsvp$config$$config['trigger'](entry.name, entry.payload);
        }
        lib$rsvp$instrument$$queue.length = 0;
      }, 50);
    }

    function lib$rsvp$instrument$$instrument(eventName, promise, child) {
      if (1 === lib$rsvp$instrument$$queue.push({
        name: eventName,
        payload: {
          key: promise._guidKey,
          id:  promise._id,
          eventName: eventName,
          detail: promise._result,
          childId: child && child._id,
          label: promise._label,
          timeStamp: lib$rsvp$utils$$now(),
          error: lib$rsvp$config$$config["instrument-with-stack"] ? new Error(promise._label) : null
        }})) {
          lib$rsvp$instrument$$scheduleFlush();
        }
      }
    var lib$rsvp$instrument$$default = lib$rsvp$instrument$$instrument;

    function  lib$rsvp$$internal$$withOwnPromise() {
      return new TypeError('A promises callback cannot return that same promise.');
    }

    function lib$rsvp$$internal$$noop() {}

    var lib$rsvp$$internal$$PENDING   = void 0;
    var lib$rsvp$$internal$$FULFILLED = 1;
    var lib$rsvp$$internal$$REJECTED  = 2;

    var lib$rsvp$$internal$$GET_THEN_ERROR = new lib$rsvp$$internal$$ErrorObject();

    function lib$rsvp$$internal$$getThen(promise) {
      try {
        return promise.then;
      } catch(error) {
        lib$rsvp$$internal$$GET_THEN_ERROR.error = error;
        return lib$rsvp$$internal$$GET_THEN_ERROR;
      }
    }

    function lib$rsvp$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch(e) {
        return e;
      }
    }

    function lib$rsvp$$internal$$handleForeignThenable(promise, thenable, then) {
      lib$rsvp$config$$config.async(function(promise) {
        var sealed = false;
        var error = lib$rsvp$$internal$$tryThen(then, thenable, function(value) {
          if (sealed) { return; }
          sealed = true;
          if (thenable !== value) {
            lib$rsvp$$internal$$resolve(promise, value);
          } else {
            lib$rsvp$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) { return; }
          sealed = true;

          lib$rsvp$$internal$$reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          lib$rsvp$$internal$$reject(promise, error);
        }
      }, promise);
    }

    function lib$rsvp$$internal$$handleOwnThenable(promise, thenable) {
      if (thenable._state === lib$rsvp$$internal$$FULFILLED) {
        lib$rsvp$$internal$$fulfill(promise, thenable._result);
      } else if (thenable._state === lib$rsvp$$internal$$REJECTED) {
        thenable._onError = null;
        lib$rsvp$$internal$$reject(promise, thenable._result);
      } else {
        lib$rsvp$$internal$$subscribe(thenable, undefined, function(value) {
          if (thenable !== value) {
            lib$rsvp$$internal$$resolve(promise, value);
          } else {
            lib$rsvp$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          lib$rsvp$$internal$$reject(promise, reason);
        });
      }
    }

    function lib$rsvp$$internal$$handleMaybeThenable(promise, maybeThenable) {
      if (maybeThenable.constructor === promise.constructor) {
        lib$rsvp$$internal$$handleOwnThenable(promise, maybeThenable);
      } else {
        var then = lib$rsvp$$internal$$getThen(maybeThenable);

        if (then === lib$rsvp$$internal$$GET_THEN_ERROR) {
          lib$rsvp$$internal$$reject(promise, lib$rsvp$$internal$$GET_THEN_ERROR.error);
        } else if (then === undefined) {
          lib$rsvp$$internal$$fulfill(promise, maybeThenable);
        } else if (lib$rsvp$utils$$isFunction(then)) {
          lib$rsvp$$internal$$handleForeignThenable(promise, maybeThenable, then);
        } else {
          lib$rsvp$$internal$$fulfill(promise, maybeThenable);
        }
      }
    }

    function lib$rsvp$$internal$$resolve(promise, value) {
      if (promise === value) {
        lib$rsvp$$internal$$fulfill(promise, value);
      } else if (lib$rsvp$utils$$objectOrFunction(value)) {
        lib$rsvp$$internal$$handleMaybeThenable(promise, value);
      } else {
        lib$rsvp$$internal$$fulfill(promise, value);
      }
    }

    function lib$rsvp$$internal$$publishRejection(promise) {
      if (promise._onError) {
        promise._onError(promise._result);
      }

      lib$rsvp$$internal$$publish(promise);
    }

    function lib$rsvp$$internal$$fulfill(promise, value) {
      if (promise._state !== lib$rsvp$$internal$$PENDING) { return; }

      promise._result = value;
      promise._state = lib$rsvp$$internal$$FULFILLED;

      if (promise._subscribers.length === 0) {
        if (lib$rsvp$config$$config.instrument) {
          lib$rsvp$instrument$$default('fulfilled', promise);
        }
      } else {
        lib$rsvp$config$$config.async(lib$rsvp$$internal$$publish, promise);
      }
    }

    function lib$rsvp$$internal$$reject(promise, reason) {
      if (promise._state !== lib$rsvp$$internal$$PENDING) { return; }
      promise._state = lib$rsvp$$internal$$REJECTED;
      promise._result = reason;
      lib$rsvp$config$$config.async(lib$rsvp$$internal$$publishRejection, promise);
    }

    function lib$rsvp$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      parent._onError = null;

      subscribers[length] = child;
      subscribers[length + lib$rsvp$$internal$$FULFILLED] = onFulfillment;
      subscribers[length + lib$rsvp$$internal$$REJECTED]  = onRejection;

      if (length === 0 && parent._state) {
        lib$rsvp$config$$config.async(lib$rsvp$$internal$$publish, parent);
      }
    }

    function lib$rsvp$$internal$$publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (lib$rsvp$config$$config.instrument) {
        lib$rsvp$instrument$$default(settled === lib$rsvp$$internal$$FULFILLED ? 'fulfilled' : 'rejected', promise);
      }

      if (subscribers.length === 0) { return; }

      var child, callback, detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          lib$rsvp$$internal$$invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function lib$rsvp$$internal$$ErrorObject() {
      this.error = null;
    }

    var lib$rsvp$$internal$$TRY_CATCH_ERROR = new lib$rsvp$$internal$$ErrorObject();

    function lib$rsvp$$internal$$tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch(e) {
        lib$rsvp$$internal$$TRY_CATCH_ERROR.error = e;
        return lib$rsvp$$internal$$TRY_CATCH_ERROR;
      }
    }

    function lib$rsvp$$internal$$invokeCallback(settled, promise, callback, detail) {
      var hasCallback = lib$rsvp$utils$$isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        value = lib$rsvp$$internal$$tryCatch(callback, detail);

        if (value === lib$rsvp$$internal$$TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          lib$rsvp$$internal$$reject(promise, lib$rsvp$$internal$$withOwnPromise());
          return;
        }

      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== lib$rsvp$$internal$$PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        lib$rsvp$$internal$$resolve(promise, value);
      } else if (failed) {
        lib$rsvp$$internal$$reject(promise, error);
      } else if (settled === lib$rsvp$$internal$$FULFILLED) {
        lib$rsvp$$internal$$fulfill(promise, value);
      } else if (settled === lib$rsvp$$internal$$REJECTED) {
        lib$rsvp$$internal$$reject(promise, value);
      }
    }

    function lib$rsvp$$internal$$initializePromise(promise, resolver) {
      var resolved = false;
      try {
        resolver(function resolvePromise(value){
          if (resolved) { return; }
          resolved = true;
          lib$rsvp$$internal$$resolve(promise, value);
        }, function rejectPromise(reason) {
          if (resolved) { return; }
          resolved = true;
          lib$rsvp$$internal$$reject(promise, reason);
        });
      } catch(e) {
        lib$rsvp$$internal$$reject(promise, e);
      }
    }

    function lib$rsvp$enumerator$$makeSettledResult(state, position, value) {
      if (state === lib$rsvp$$internal$$FULFILLED) {
        return {
          state: 'fulfilled',
          value: value
        };
      } else {
         return {
          state: 'rejected',
          reason: value
        };
      }
    }

    function lib$rsvp$enumerator$$Enumerator(Constructor, input, abortOnReject, label) {
      var enumerator = this;

      enumerator._instanceConstructor = Constructor;
      enumerator.promise = new Constructor(lib$rsvp$$internal$$noop, label);
      enumerator._abortOnReject = abortOnReject;

      if (enumerator._validateInput(input)) {
        enumerator._input     = input;
        enumerator.length     = input.length;
        enumerator._remaining = input.length;

        enumerator._init();

        if (enumerator.length === 0) {
          lib$rsvp$$internal$$fulfill(enumerator.promise, enumerator._result);
        } else {
          enumerator.length = enumerator.length || 0;
          enumerator._enumerate();
          if (enumerator._remaining === 0) {
            lib$rsvp$$internal$$fulfill(enumerator.promise, enumerator._result);
          }
        }
      } else {
        lib$rsvp$$internal$$reject(enumerator.promise, enumerator._validationError());
      }
    }

    var lib$rsvp$enumerator$$default = lib$rsvp$enumerator$$Enumerator;

    lib$rsvp$enumerator$$Enumerator.prototype._validateInput = function(input) {
      return lib$rsvp$utils$$isArray(input);
    };

    lib$rsvp$enumerator$$Enumerator.prototype._validationError = function() {
      return new Error('Array Methods must be provided an Array');
    };

    lib$rsvp$enumerator$$Enumerator.prototype._init = function() {
      this._result = new Array(this.length);
    };

    lib$rsvp$enumerator$$Enumerator.prototype._enumerate = function() {
      var enumerator = this;
      var length     = enumerator.length;
      var promise    = enumerator.promise;
      var input      = enumerator._input;

      for (var i = 0; promise._state === lib$rsvp$$internal$$PENDING && i < length; i++) {
        enumerator._eachEntry(input[i], i);
      }
    };

    lib$rsvp$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
      var enumerator = this;
      var c = enumerator._instanceConstructor;
      if (lib$rsvp$utils$$isMaybeThenable(entry)) {
        if (entry.constructor === c && entry._state !== lib$rsvp$$internal$$PENDING) {
          entry._onError = null;
          enumerator._settledAt(entry._state, i, entry._result);
        } else {
          enumerator._willSettleAt(c.resolve(entry), i);
        }
      } else {
        enumerator._remaining--;
        enumerator._result[i] = enumerator._makeResult(lib$rsvp$$internal$$FULFILLED, i, entry);
      }
    };

    lib$rsvp$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
      var enumerator = this;
      var promise = enumerator.promise;

      if (promise._state === lib$rsvp$$internal$$PENDING) {
        enumerator._remaining--;

        if (enumerator._abortOnReject && state === lib$rsvp$$internal$$REJECTED) {
          lib$rsvp$$internal$$reject(promise, value);
        } else {
          enumerator._result[i] = enumerator._makeResult(state, i, value);
        }
      }

      if (enumerator._remaining === 0) {
        lib$rsvp$$internal$$fulfill(promise, enumerator._result);
      }
    };

    lib$rsvp$enumerator$$Enumerator.prototype._makeResult = function(state, i, value) {
      return value;
    };

    lib$rsvp$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
      var enumerator = this;

      lib$rsvp$$internal$$subscribe(promise, undefined, function(value) {
        enumerator._settledAt(lib$rsvp$$internal$$FULFILLED, i, value);
      }, function(reason) {
        enumerator._settledAt(lib$rsvp$$internal$$REJECTED, i, reason);
      });
    };
    function lib$rsvp$promise$all$$all(entries, label) {
      return new lib$rsvp$enumerator$$default(this, entries, true /* abort on reject */, label).promise;
    }
    var lib$rsvp$promise$all$$default = lib$rsvp$promise$all$$all;
    function lib$rsvp$promise$race$$race(entries, label) {
      /*jshint validthis:true */
      var Constructor = this;

      var promise = new Constructor(lib$rsvp$$internal$$noop, label);

      if (!lib$rsvp$utils$$isArray(entries)) {
        lib$rsvp$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
        return promise;
      }

      var length = entries.length;

      function onFulfillment(value) {
        lib$rsvp$$internal$$resolve(promise, value);
      }

      function onRejection(reason) {
        lib$rsvp$$internal$$reject(promise, reason);
      }

      for (var i = 0; promise._state === lib$rsvp$$internal$$PENDING && i < length; i++) {
        lib$rsvp$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
      }

      return promise;
    }
    var lib$rsvp$promise$race$$default = lib$rsvp$promise$race$$race;
    function lib$rsvp$promise$resolve$$resolve(object, label) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor(lib$rsvp$$internal$$noop, label);
      lib$rsvp$$internal$$resolve(promise, object);
      return promise;
    }
    var lib$rsvp$promise$resolve$$default = lib$rsvp$promise$resolve$$resolve;
    function lib$rsvp$promise$reject$$reject(reason, label) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor(lib$rsvp$$internal$$noop, label);
      lib$rsvp$$internal$$reject(promise, reason);
      return promise;
    }
    var lib$rsvp$promise$reject$$default = lib$rsvp$promise$reject$$reject;

    var lib$rsvp$promise$$guidKey = 'rsvp_' + lib$rsvp$utils$$now() + '-';
    var lib$rsvp$promise$$counter = 0;

    function lib$rsvp$promise$$needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function lib$rsvp$promise$$needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    function lib$rsvp$promise$$Promise(resolver, label) {
      var promise = this;

      promise._id = lib$rsvp$promise$$counter++;
      promise._label = label;
      promise._state = undefined;
      promise._result = undefined;
      promise._subscribers = [];

      if (lib$rsvp$config$$config.instrument) {
        lib$rsvp$instrument$$default('created', promise);
      }

      if (lib$rsvp$$internal$$noop !== resolver) {
        if (!lib$rsvp$utils$$isFunction(resolver)) {
          lib$rsvp$promise$$needsResolver();
        }

        if (!(promise instanceof lib$rsvp$promise$$Promise)) {
          lib$rsvp$promise$$needsNew();
        }

        lib$rsvp$$internal$$initializePromise(promise, resolver);
      }
    }

    var lib$rsvp$promise$$default = lib$rsvp$promise$$Promise;

    // deprecated
    lib$rsvp$promise$$Promise.cast = lib$rsvp$promise$resolve$$default;
    lib$rsvp$promise$$Promise.all = lib$rsvp$promise$all$$default;
    lib$rsvp$promise$$Promise.race = lib$rsvp$promise$race$$default;
    lib$rsvp$promise$$Promise.resolve = lib$rsvp$promise$resolve$$default;
    lib$rsvp$promise$$Promise.reject = lib$rsvp$promise$reject$$default;

    lib$rsvp$promise$$Promise.prototype = {
      constructor: lib$rsvp$promise$$Promise,

      _guidKey: lib$rsvp$promise$$guidKey,

      _onError: function (reason) {
        var promise = this;
        lib$rsvp$config$$config.after(function() {
          if (promise._onError) {
            lib$rsvp$config$$config['trigger']('error', reason, promise._label);
          }
        });
      },

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.

      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```

      Chaining
      --------

      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.

      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });

      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```

      Assimilation
      ------------

      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```

      If the assimliated promise rejects, then the downstream promise will also reject.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```

      Simple Example
      --------------

      Synchronous Example

      ```javascript
      var result;

      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```

      Advanced Example
      --------------

      Synchronous Example

      ```javascript
      var author, books;

      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js

      function foundBooks(books) {

      }

      function failure(reason) {

      }

      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```

      @method then
      @param {Function} onFulfillment
      @param {Function} onRejection
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise}
    */
      then: function(onFulfillment, onRejection, label) {
        var parent = this;
        var state = parent._state;

        if (state === lib$rsvp$$internal$$FULFILLED && !onFulfillment || state === lib$rsvp$$internal$$REJECTED && !onRejection) {
          if (lib$rsvp$config$$config.instrument) {
            lib$rsvp$instrument$$default('chained', parent, parent);
          }
          return parent;
        }

        parent._onError = null;

        var child = new parent.constructor(lib$rsvp$$internal$$noop, label);
        var result = parent._result;

        if (lib$rsvp$config$$config.instrument) {
          lib$rsvp$instrument$$default('chained', parent, child);
        }

        if (state) {
          var callback = arguments[state - 1];
          lib$rsvp$config$$config.async(function(){
            lib$rsvp$$internal$$invokeCallback(state, child, callback, result);
          });
        } else {
          lib$rsvp$$internal$$subscribe(parent, child, onFulfillment, onRejection);
        }

        return child;
      },

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.

      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }

      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }

      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```

      @method catch
      @param {Function} onRejection
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise}
    */
      'catch': function(onRejection, label) {
        return this.then(undefined, onRejection, label);
      },

    /**
      `finally` will be invoked regardless of the promise's fate just as native
      try/catch/finally behaves

      Synchronous example:

      ```js
      findAuthor() {
        if (Math.random() > 0.5) {
          throw new Error();
        }
        return new Author();
      }

      try {
        return findAuthor(); // succeed or fail
      } catch(error) {
        return findOtherAuther();
      } finally {
        // always runs
        // doesn't affect the return value
      }
      ```

      Asynchronous example:

      ```js
      findAuthor().catch(function(reason){
        return findOtherAuther();
      }).finally(function(){
        // author was either found, or not
      });
      ```

      @method finally
      @param {Function} callback
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise}
    */
      'finally': function(callback, label) {
        var promise = this;
        var constructor = promise.constructor;

        return promise.then(function(value) {
          return constructor.resolve(callback()).then(function(){
            return value;
          });
        }, function(reason) {
          return constructor.resolve(callback()).then(function(){
            throw reason;
          });
        }, label);
      }
    };

    function lib$rsvp$all$settled$$AllSettled(Constructor, entries, label) {
      this._superConstructor(Constructor, entries, false /* don't abort on reject */, label);
    }

    lib$rsvp$all$settled$$AllSettled.prototype = lib$rsvp$utils$$o_create(lib$rsvp$enumerator$$default.prototype);
    lib$rsvp$all$settled$$AllSettled.prototype._superConstructor = lib$rsvp$enumerator$$default;
    lib$rsvp$all$settled$$AllSettled.prototype._makeResult = lib$rsvp$enumerator$$makeSettledResult;
    lib$rsvp$all$settled$$AllSettled.prototype._validationError = function() {
      return new Error('allSettled must be called with an array');
    };

    function lib$rsvp$all$settled$$allSettled(entries, label) {
      return new lib$rsvp$all$settled$$AllSettled(lib$rsvp$promise$$default, entries, label).promise;
    }
    var lib$rsvp$all$settled$$default = lib$rsvp$all$settled$$allSettled;
    function lib$rsvp$all$$all(array, label) {
      return lib$rsvp$promise$$default.all(array, label);
    }
    var lib$rsvp$all$$default = lib$rsvp$all$$all;
    var lib$rsvp$asap$$len = 0;
    var lib$rsvp$asap$$toString = {}.toString;
    var lib$rsvp$asap$$vertxNext;
    function lib$rsvp$asap$$asap(callback, arg) {
      lib$rsvp$asap$$queue[lib$rsvp$asap$$len] = callback;
      lib$rsvp$asap$$queue[lib$rsvp$asap$$len + 1] = arg;
      lib$rsvp$asap$$len += 2;
      if (lib$rsvp$asap$$len === 2) {
        // If len is 1, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        lib$rsvp$asap$$scheduleFlush();
      }
    }

    var lib$rsvp$asap$$default = lib$rsvp$asap$$asap;

    var lib$rsvp$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
    var lib$rsvp$asap$$browserGlobal = lib$rsvp$asap$$browserWindow || {};
    var lib$rsvp$asap$$BrowserMutationObserver = lib$rsvp$asap$$browserGlobal.MutationObserver || lib$rsvp$asap$$browserGlobal.WebKitMutationObserver;
    var lib$rsvp$asap$$isNode = typeof self === 'undefined' &&
      typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

    // test for web worker but not in IE10
    var lib$rsvp$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
      typeof importScripts !== 'undefined' &&
      typeof MessageChannel !== 'undefined';

    // node
    function lib$rsvp$asap$$useNextTick() {
      var nextTick = process.nextTick;
      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
      // setImmediate should be used instead instead
      var version = process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
      if (Array.isArray(version) && version[1] === '0' && version[2] === '10') {
        nextTick = setImmediate;
      }
      return function() {
        nextTick(lib$rsvp$asap$$flush);
      };
    }

    // vertx
    function lib$rsvp$asap$$useVertxTimer() {
      return function() {
        lib$rsvp$asap$$vertxNext(lib$rsvp$asap$$flush);
      };
    }

    function lib$rsvp$asap$$useMutationObserver() {
      var iterations = 0;
      var observer = new lib$rsvp$asap$$BrowserMutationObserver(lib$rsvp$asap$$flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    // web worker
    function lib$rsvp$asap$$useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = lib$rsvp$asap$$flush;
      return function () {
        channel.port2.postMessage(0);
      };
    }

    function lib$rsvp$asap$$useSetTimeout() {
      return function() {
        setTimeout(lib$rsvp$asap$$flush, 1);
      };
    }

    var lib$rsvp$asap$$queue = new Array(1000);
    function lib$rsvp$asap$$flush() {
      for (var i = 0; i < lib$rsvp$asap$$len; i+=2) {
        var callback = lib$rsvp$asap$$queue[i];
        var arg = lib$rsvp$asap$$queue[i+1];

        callback(arg);

        lib$rsvp$asap$$queue[i] = undefined;
        lib$rsvp$asap$$queue[i+1] = undefined;
      }

      lib$rsvp$asap$$len = 0;
    }

    function lib$rsvp$asap$$attemptVertex() {
      try {
        var r = require;
        var vertx = r('vertx');
        lib$rsvp$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
        return lib$rsvp$asap$$useVertxTimer();
      } catch(e) {
        return lib$rsvp$asap$$useSetTimeout();
      }
    }

    var lib$rsvp$asap$$scheduleFlush;
    // Decide what async method to use to triggering processing of queued callbacks:
    if (lib$rsvp$asap$$isNode) {
      lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$useNextTick();
    } else if (lib$rsvp$asap$$BrowserMutationObserver) {
      lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$useMutationObserver();
    } else if (lib$rsvp$asap$$isWorker) {
      lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$useMessageChannel();
    } else if (lib$rsvp$asap$$browserWindow === undefined && typeof require === 'function') {
      lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$attemptVertex();
    } else {
      lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$useSetTimeout();
    }
    function lib$rsvp$defer$$defer(label) {
      var deferred = {};

      deferred['promise'] = new lib$rsvp$promise$$default(function(resolve, reject) {
        deferred['resolve'] = resolve;
        deferred['reject'] = reject;
      }, label);

      return deferred;
    }
    var lib$rsvp$defer$$default = lib$rsvp$defer$$defer;
    function lib$rsvp$filter$$filter(promises, filterFn, label) {
      return lib$rsvp$promise$$default.all(promises, label).then(function(values) {
        if (!lib$rsvp$utils$$isFunction(filterFn)) {
          throw new TypeError("You must pass a function as filter's second argument.");
        }

        var length = values.length;
        var filtered = new Array(length);

        for (var i = 0; i < length; i++) {
          filtered[i] = filterFn(values[i]);
        }

        return lib$rsvp$promise$$default.all(filtered, label).then(function(filtered) {
          var results = new Array(length);
          var newLength = 0;

          for (var i = 0; i < length; i++) {
            if (filtered[i]) {
              results[newLength] = values[i];
              newLength++;
            }
          }

          results.length = newLength;

          return results;
        });
      });
    }
    var lib$rsvp$filter$$default = lib$rsvp$filter$$filter;

    function lib$rsvp$promise$hash$$PromiseHash(Constructor, object, label) {
      this._superConstructor(Constructor, object, true, label);
    }

    var lib$rsvp$promise$hash$$default = lib$rsvp$promise$hash$$PromiseHash;

    lib$rsvp$promise$hash$$PromiseHash.prototype = lib$rsvp$utils$$o_create(lib$rsvp$enumerator$$default.prototype);
    lib$rsvp$promise$hash$$PromiseHash.prototype._superConstructor = lib$rsvp$enumerator$$default;
    lib$rsvp$promise$hash$$PromiseHash.prototype._init = function() {
      this._result = {};
    };

    lib$rsvp$promise$hash$$PromiseHash.prototype._validateInput = function(input) {
      return input && typeof input === 'object';
    };

    lib$rsvp$promise$hash$$PromiseHash.prototype._validationError = function() {
      return new Error('Promise.hash must be called with an object');
    };

    lib$rsvp$promise$hash$$PromiseHash.prototype._enumerate = function() {
      var enumerator = this;
      var promise    = enumerator.promise;
      var input      = enumerator._input;
      var results    = [];

      for (var key in input) {
        if (promise._state === lib$rsvp$$internal$$PENDING && Object.prototype.hasOwnProperty.call(input, key)) {
          results.push({
            position: key,
            entry: input[key]
          });
        }
      }

      var length = results.length;
      enumerator._remaining = length;
      var result;

      for (var i = 0; promise._state === lib$rsvp$$internal$$PENDING && i < length; i++) {
        result = results[i];
        enumerator._eachEntry(result.entry, result.position);
      }
    };

    function lib$rsvp$hash$settled$$HashSettled(Constructor, object, label) {
      this._superConstructor(Constructor, object, false, label);
    }

    lib$rsvp$hash$settled$$HashSettled.prototype = lib$rsvp$utils$$o_create(lib$rsvp$promise$hash$$default.prototype);
    lib$rsvp$hash$settled$$HashSettled.prototype._superConstructor = lib$rsvp$enumerator$$default;
    lib$rsvp$hash$settled$$HashSettled.prototype._makeResult = lib$rsvp$enumerator$$makeSettledResult;

    lib$rsvp$hash$settled$$HashSettled.prototype._validationError = function() {
      return new Error('hashSettled must be called with an object');
    };

    function lib$rsvp$hash$settled$$hashSettled(object, label) {
      return new lib$rsvp$hash$settled$$HashSettled(lib$rsvp$promise$$default, object, label).promise;
    }
    var lib$rsvp$hash$settled$$default = lib$rsvp$hash$settled$$hashSettled;
    function lib$rsvp$hash$$hash(object, label) {
      return new lib$rsvp$promise$hash$$default(lib$rsvp$promise$$default, object, label).promise;
    }
    var lib$rsvp$hash$$default = lib$rsvp$hash$$hash;
    function lib$rsvp$map$$map(promises, mapFn, label) {
      return lib$rsvp$promise$$default.all(promises, label).then(function(values) {
        if (!lib$rsvp$utils$$isFunction(mapFn)) {
          throw new TypeError("You must pass a function as map's second argument.");
        }

        var length = values.length;
        var results = new Array(length);

        for (var i = 0; i < length; i++) {
          results[i] = mapFn(values[i]);
        }

        return lib$rsvp$promise$$default.all(results, label);
      });
    }
    var lib$rsvp$map$$default = lib$rsvp$map$$map;

    function lib$rsvp$node$$Result() {
      this.value = undefined;
    }

    var lib$rsvp$node$$ERROR = new lib$rsvp$node$$Result();
    var lib$rsvp$node$$GET_THEN_ERROR = new lib$rsvp$node$$Result();

    function lib$rsvp$node$$getThen(obj) {
      try {
       return obj.then;
      } catch(error) {
        lib$rsvp$node$$ERROR.value= error;
        return lib$rsvp$node$$ERROR;
      }
    }


    function lib$rsvp$node$$tryApply(f, s, a) {
      try {
        f.apply(s, a);
      } catch(error) {
        lib$rsvp$node$$ERROR.value = error;
        return lib$rsvp$node$$ERROR;
      }
    }

    function lib$rsvp$node$$makeObject(_, argumentNames) {
      var obj = {};
      var name;
      var i;
      var length = _.length;
      var args = new Array(length);

      for (var x = 0; x < length; x++) {
        args[x] = _[x];
      }

      for (i = 0; i < argumentNames.length; i++) {
        name = argumentNames[i];
        obj[name] = args[i + 1];
      }

      return obj;
    }

    function lib$rsvp$node$$arrayResult(_) {
      var length = _.length;
      var args = new Array(length - 1);

      for (var i = 1; i < length; i++) {
        args[i - 1] = _[i];
      }

      return args;
    }

    function lib$rsvp$node$$wrapThenable(then, promise) {
      return {
        then: function(onFulFillment, onRejection) {
          return then.call(promise, onFulFillment, onRejection);
        }
      };
    }

    function lib$rsvp$node$$denodeify(nodeFunc, options) {
      var fn = function() {
        var self = this;
        var l = arguments.length;
        var args = new Array(l + 1);
        var arg;
        var promiseInput = false;

        for (var i = 0; i < l; ++i) {
          arg = arguments[i];

          if (!promiseInput) {
            // TODO: clean this up
            promiseInput = lib$rsvp$node$$needsPromiseInput(arg);
            if (promiseInput === lib$rsvp$node$$GET_THEN_ERROR) {
              var p = new lib$rsvp$promise$$default(lib$rsvp$$internal$$noop);
              lib$rsvp$$internal$$reject(p, lib$rsvp$node$$GET_THEN_ERROR.value);
              return p;
            } else if (promiseInput && promiseInput !== true) {
              arg = lib$rsvp$node$$wrapThenable(promiseInput, arg);
            }
          }
          args[i] = arg;
        }

        var promise = new lib$rsvp$promise$$default(lib$rsvp$$internal$$noop);

        args[l] = function(err, val) {
          if (err)
            lib$rsvp$$internal$$reject(promise, err);
          else if (options === undefined)
            lib$rsvp$$internal$$resolve(promise, val);
          else if (options === true)
            lib$rsvp$$internal$$resolve(promise, lib$rsvp$node$$arrayResult(arguments));
          else if (lib$rsvp$utils$$isArray(options))
            lib$rsvp$$internal$$resolve(promise, lib$rsvp$node$$makeObject(arguments, options));
          else
            lib$rsvp$$internal$$resolve(promise, val);
        };

        if (promiseInput) {
          return lib$rsvp$node$$handlePromiseInput(promise, args, nodeFunc, self);
        } else {
          return lib$rsvp$node$$handleValueInput(promise, args, nodeFunc, self);
        }
      };

      fn.__proto__ = nodeFunc;

      return fn;
    }

    var lib$rsvp$node$$default = lib$rsvp$node$$denodeify;

    function lib$rsvp$node$$handleValueInput(promise, args, nodeFunc, self) {
      var result = lib$rsvp$node$$tryApply(nodeFunc, self, args);
      if (result === lib$rsvp$node$$ERROR) {
        lib$rsvp$$internal$$reject(promise, result.value);
      }
      return promise;
    }

    function lib$rsvp$node$$handlePromiseInput(promise, args, nodeFunc, self){
      return lib$rsvp$promise$$default.all(args).then(function(args){
        var result = lib$rsvp$node$$tryApply(nodeFunc, self, args);
        if (result === lib$rsvp$node$$ERROR) {
          lib$rsvp$$internal$$reject(promise, result.value);
        }
        return promise;
      });
    }

    function lib$rsvp$node$$needsPromiseInput(arg) {
      if (arg && typeof arg === 'object') {
        if (arg.constructor === lib$rsvp$promise$$default) {
          return true;
        } else {
          return lib$rsvp$node$$getThen(arg);
        }
      } else {
        return false;
      }
    }
    var lib$rsvp$platform$$platform;

    /* global self */
    if (typeof self === 'object') {
      lib$rsvp$platform$$platform = self;

    /* global global */
    } else if (typeof global === 'object') {
      lib$rsvp$platform$$platform = global;
    } else {
      throw new Error('no global: `self` or `global` found');
    }

    var lib$rsvp$platform$$default = lib$rsvp$platform$$platform;
    function lib$rsvp$race$$race(array, label) {
      return lib$rsvp$promise$$default.race(array, label);
    }
    var lib$rsvp$race$$default = lib$rsvp$race$$race;
    function lib$rsvp$reject$$reject(reason, label) {
      return lib$rsvp$promise$$default.reject(reason, label);
    }
    var lib$rsvp$reject$$default = lib$rsvp$reject$$reject;
    function lib$rsvp$resolve$$resolve(value, label) {
      return lib$rsvp$promise$$default.resolve(value, label);
    }
    var lib$rsvp$resolve$$default = lib$rsvp$resolve$$resolve;
    function lib$rsvp$rethrow$$rethrow(reason) {
      setTimeout(function() {
        throw reason;
      });
      throw reason;
    }
    var lib$rsvp$rethrow$$default = lib$rsvp$rethrow$$rethrow;

    // defaults
    lib$rsvp$config$$config.async = lib$rsvp$asap$$default;
    lib$rsvp$config$$config.after = function(cb) {
      setTimeout(cb, 0);
    };
    var lib$rsvp$$cast = lib$rsvp$resolve$$default;
    function lib$rsvp$$async(callback, arg) {
      lib$rsvp$config$$config.async(callback, arg);
    }

    function lib$rsvp$$on() {
      lib$rsvp$config$$config['on'].apply(lib$rsvp$config$$config, arguments);
    }

    function lib$rsvp$$off() {
      lib$rsvp$config$$config['off'].apply(lib$rsvp$config$$config, arguments);
    }

    // Set up instrumentation through `window.__PROMISE_INTRUMENTATION__`
    if (typeof window !== 'undefined' && typeof window['__PROMISE_INSTRUMENTATION__'] === 'object') {
      var lib$rsvp$$callbacks = window['__PROMISE_INSTRUMENTATION__'];
      lib$rsvp$config$$configure('instrument', true);
      for (var lib$rsvp$$eventName in lib$rsvp$$callbacks) {
        if (lib$rsvp$$callbacks.hasOwnProperty(lib$rsvp$$eventName)) {
          lib$rsvp$$on(lib$rsvp$$eventName, lib$rsvp$$callbacks[lib$rsvp$$eventName]);
        }
      }
    }

    var lib$rsvp$umd$$RSVP = {
      'race': lib$rsvp$race$$default,
      'Promise': lib$rsvp$promise$$default,
      'allSettled': lib$rsvp$all$settled$$default,
      'hash': lib$rsvp$hash$$default,
      'hashSettled': lib$rsvp$hash$settled$$default,
      'denodeify': lib$rsvp$node$$default,
      'on': lib$rsvp$$on,
      'off': lib$rsvp$$off,
      'map': lib$rsvp$map$$default,
      'filter': lib$rsvp$filter$$default,
      'resolve': lib$rsvp$resolve$$default,
      'reject': lib$rsvp$reject$$default,
      'all': lib$rsvp$all$$default,
      'rethrow': lib$rsvp$rethrow$$default,
      'defer': lib$rsvp$defer$$default,
      'EventTarget': lib$rsvp$events$$default,
      'configure': lib$rsvp$config$$configure,
      'async': lib$rsvp$$async
    };

    /* global define:true module:true window: true */
    if (typeof define === 'function' && define['amd']) {
      define(function() { return lib$rsvp$umd$$RSVP; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = lib$rsvp$umd$$RSVP;
    } else if (typeof lib$rsvp$platform$$default !== 'undefined') {
      lib$rsvp$platform$$default['RSVP'] = lib$rsvp$umd$$RSVP;
    }
}).call(this);


}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":1}],3:[function(require,module,exports){
(function(g, f) {
	if (typeof define==='function' && define.amd)
		define([], f);
	else if (typeof module==='object' && module.exports)
		module.exports = f();
	else
		g.templeton = f();
}(this, function() {
	var keyPath = /(\.{2,}|\[(['"])([^\.]*?)\1\])/g,
		trimDots = /(^\.|\.$)/g,
		empty = {},
		templeton;

	function execHelper(name, text) {
		var parts = name.split(':'),
			id = parts[0],
			h = templeton.helpers[id];
		if (typeof h==='string') {
			return templeton.template(h, text);
		}
		parts.splice(0, 1, text);
		return h.apply(templeton.helpers, parts);
	}

	/** A simple template engine with iterators and extensible block helpers */
	return (templeton = {

		/** Allow "~" and "__path__" special keys? */
		extendedKeys : true,

		/** Helpers can be simple templates, or transformation functions */
		helpers : {
			link : '<a href="{{href}}">{{title}}</a>',

			html : function(v) {
				return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
			},

			escape : function(v) {
				return encodeURIComponent(v);
			},

			json : function(v) {
				return JSON.stringify(v);
			}
		},

		/** Custom modifiers registered as single-character key prefixes */
		refs : {
			/*
			// Example ref: "{{@greeting.welcome}}"
			'@' : function(fields, key, fallback) {
				return templeton.delve(fields, 'locale.'+key, fallback);
			}
			*/
		},

		/**	Deal with types of blocks */
		blockHelpers : {

			_default : function(ctx) {
				return this[ (ctx.value && ctx.value.splice) ? 'each' : 'if' ](ctx);
			},

			/** Basic iterator */
			each : function(ctx) {
				var out='', p, fields,
					top = ctx.fields,
					obj = ctx.value;
				if (templeton.extendedKeys!==false) {
					fields = {
						'~' : top,
						__path__ : ctx.id==='.' ? ctx.path : ctx.id
					};
				}
				for (p in obj) {
					if (obj.hasOwnProperty(p)) {
						if (fields) {
							fields.__key__ = p;
						}
						out += templeton.template(ctx.content, obj[p], fields);
					}
				}
				return out;
			},

			/** Conditional block */
			'if' : function(ctx) {
				return ctx.value ? templeton.template(ctx.content, ctx.fields, ctx.overrides) : '';
			},

			/** Conditional block (inverted) */
			'else' : function(ctx) {
				return ctx.value ? '' : templeton.template(ctx.content, ctx.fields, ctx.overrides);
			},

			'unless' : function(ctx) {
				return this['else'](ctx);
			}

		},

		/** The guts. */
		template : function(text, fields, _overrides) {
			var tokenizer = /\{\{\{?([#\/\:]?)([^ \{\}\|]+)(?: ([^\{\}\|]*?))?(?:\|([^\{\}]*?))?\}?\}\}/g,
				out = '',
				t, j, r, f, index, mods, token, html,
				stack = [],
				ctx;
			ctx = {
				fields : fields || {},
				overrides : _overrides || empty
			};
			ctx.path = (ctx.overrides.__path__?(ctx.overrides.__path__+'.'):'')+ctx.overrides.__key__;
			tokenizer.lastIndex = 0;
			while ( (token=tokenizer.exec(text)) ) {
				if (stack.length===0) {
					out += text.substring(index || 0, tokenizer.lastIndex - token[0].length);
				}
				t = token[1];
				if (!t || (t!=='#' && t!==':' && t!=='/')) {
					f = token[2];
					if (stack.length===0) {
						if (t) {
							r = templeton.refs[t](fields, f, null);
						}
						else {
							r = ctx.overrides[f] || templeton.delve(fields, f, null);
						}
						if (r===null) {
							out += token[0];
						}
						else {
							html = token[0].charAt(2)!=='{';
							if (token[4]) {
								mods = token[4].split('|');
								for (j=0; j<mods.length; j++) {
									if (templeton.helpers.hasOwnProperty(mods[j])) {
										if (mods[j]==='html') {
											html = false;
										}
										r = execHelper(mods[j], r);
									}
								}
							}
							if (html) {
								r = templeton.helpers.html(r);
							}
							out += r;
						}
					}
				}
				else {
					if (t==='/' || t===':') {
						ctx.id = stack.pop();
						ctx.value = ctx.overrides[ctx.id] || templeton.delve(fields, ctx.id, null);
						if (stack.length===0) {
							ctx.content = text.substring(ctx.blockStart, tokenizer.lastIndex - token[0].length);
							r = templeton.blockHelpers[ctx.blockHelper](ctx);
							if (r && typeof(r)==='string') {
								out += r;
							}
						}
						ctx.previousBlockHelper = ctx.blockHelper;
						ctx.previousId = ctx.id;
						ctx.previousValue = ctx.value;
					}
					if (t==='#' || t===':') {
						if (!token[3]) token.splice(2, 0, '_default');
						stack.push(t===':' ? ctx.id : token[3]);
						if (stack.length===1) {
							ctx.blockHelper = token[2];
							ctx.blockStart = tokenizer.lastIndex;
						}
						index = null;
					}
				}
				index = tokenizer.lastIndex;
			}
			out += text.substring(index);
			return out;
		},

		delve : function(obj, key, fallback) {
			var c=obj, i, l;
			if (key==='.') {
				return obj.hasOwnProperty('.') ? obj['.'] : obj;
			}
			if (key.indexOf('.')===-1) {
				return obj.hasOwnProperty(key) ? obj[key] : fallback;
			}
			if (key.indexOf('[')!==-1) {
				key = key.replace(keyPath,'.$2');
			}
			key = key.replace(trimDots,'').split('.');
			for (i=0, l=key.length; i<l; i++) {
				if (!c.hasOwnProperty(key[i])) {
					return fallback;
				}
				c = c[key[i]];
			}
			return c;
		}
	});
}));

},{}],4:[function(require,module,exports){
'use strict'

/**
* Directly require the xhttp generator, allowing the user to make an xhttp
* with a custom promise constructor.
*/

module.exports = require('./lib/xhttp')

},{"./lib/xhttp":8}],5:[function(require,module,exports){
'use strict'

/**
 * Parses the options for an xhttp request.
 */

/******************************* Dependencies ********************************/

// Custom components
var utils = require('./utils')

/********************************** Globals **********************************/

/**
 * List of keys that can be assigned from options to xhr directly.
 */
var simpleOptions = ['timeout', 'withCredentials']

/**
 * Default options.
 */
var defaults = {
  timeout: 10000,
  withCredentials: false
}

/******************************** Constructor ********************************/

/**
 * The options class. Parses the given options hash on initialisation.
 */
function Options (attributes) {
  // Make sure attributes are an object
  attributes = utils.toHash(attributes)

  // Assign defaults to self
  utils.assign(this, defaults)

  // Assign attributes to self
  utils.assign(this, attributes)

  /** Parse own properties */

  // Adjust the HTTP method
  this.$parseMethod()

  // Adjust the URL
  this.$parseUrl()

  // Adjust headers and detect content type
  this.$parseHeaders()

  // Adjust data depending on content type
  this.$parseData()
}

/********************************* Prototype *********************************/

/**
 * Figures out the HTTP method. It must be a string, we uppercase it to match
 * the spec, and the default is GET.
 */
Options.prototype.$parseMethod = function() {
  // Old method value
  var value = this.method

  if (typeof value !== 'string' || !value) this.method = 'GET'
  else this.method = value.toUpperCase()
}

/**
 * Figures out the URL based on the provided base string and parameters.
 */
Options.prototype.$parseUrl = function() {
  // Mandate some kind of string URL provided
  if (typeof this.url !== 'string' || !this.url) {
    throw new Error('an URL string is required')
  }

  // Join with params
  this.url = this.url + this.$makeParams()
}

/**
 * Returns a query string made of own params.
 */
Options.prototype.$makeParams = function() {
  var query = utils.formEncode(this.params)
  if (query) query = '?' + query
  return query
}

/**
 * Adjusts `options.headers`. Makes sure it's a hash, clones for safety, and
 * sets the content type if relevant and possible. Has no effect if
 * `options.contentType` is set to false.
 */
Options.prototype.$parseHeaders = function() {
  this.headers = utils.toHash(this.headers)

  // Quit if automatic content-type is disabled
  if (this.contentType != null && !this.contentType) return

  if (!this.headers['Content-Type']) {
    var type = utils.types[this.type] || this.$guessContentType()
    if (type) {
      this.headers['Content-Type'] = type
    }
  }
}

/**
 * Tries to guess the content-type based on the data. If data is an object,
 * this defaults to application/json.
 */
Options.prototype.$guessContentType = function() {
  if (!this.hasOwnProperty('data')) return

  if (typeof this.data === 'string') return utils.types.plain

  if (utils.isObject(this.data)) return utils.types.json
}

/**
 * Adjusts `this.data`. If we're using a no-body method, it's deleted from the
 * options. If it's not a string and we know how to convert it, it's converted.
 * Otherwise it's left unchanged. Has no effect if `options.processData` is set
 * to false.
 */
Options.prototype.$parseData = function() {
  if (this.processData != null && !this.processData) return
  if (!this.hasOwnProperty('data')) return

  // Using a no-body method -> no need to have a body
  if (this.$noBody()) {
    delete this.data
    return
  }

  // Already a string -> leave as-is
  if (typeof this.data === 'string') return

  var contentType = this.headers['Content-Type']

  // If JSON, stringify it
  if (utils.typeRegs.json.test(contentType)) {
    this.data = JSON.stringify(this.data)
    return
  }

  // If form-encoded, stringify it
  if (utils.typeRegs.form.test(contentType)) {
    this.data = utils.formEncode(this.data)
    return
  }
}

/**
 * Checks if we're using a method that doesn't send a request body.
 */
Options.prototype.$noBody = function() {
  return this.method === 'GET' || this.method === 'OPTIONS'
}

/**
 * Returns a hash of own properties that correspond to writable properties of
 * the xhr object and can be directly assigned to it.
 */
Options.prototype.$simpleOptions = function() {
  var buffer = {}

  utils.forOwn(this, function (value, key) {
    if (!~simpleOptions.indexOf(key)) return
    buffer[key] = value
  })

  return buffer
}

/********************************** Export ***********************************/

module.exports = Options

},{"./utils":7}],6:[function(require,module,exports){
'use strict'

/**
 * Returns the response data of an xhr request.
 */

/******************************* Dependencies ********************************/

// Custom components
var utils = require('./utils')

/********************************* Utilities *********************************/

/**
 * Converts a form-encoded string into a hash.
 */
function deform (string) {
  var buffer = {},
      pair, key, value

  // Loop over key=value pairs, decode key and value, and assign to buffer
  string.split('&').forEach(function (item) {
    pair = item.split('=')
    key = decodeURIComponent(pair[0])
    value = decodeURIComponent(pair[1])

    buffer[key] = value
  })

  return buffer
}

/**
 * Tries to decode the data of an xhr request based on its content-type header.
 * We can decode data sent as json or form-encoded.
 */
function parse (xhr) {
  var response    = xhr.responseText,
      contentType = xhr.getResponseHeader('Content-Type')

  if (utils.typeRegs.json.test(contentType)) {
    return JSON.parse(response)
  }

  if (utils.typeRegs.form.test(contentType)) {
    return typeof response === 'string' ? deform(response) : response
  }

  return response
}

/********************************** Export ***********************************/

module.exports = parse

},{"./utils":7}],7:[function(require,module,exports){
'use strict'

/**
 * Utils for other xhttp modules.
 */

/**************************** Utilities / Export *****************************/

/**
 * Table to map options.type to options.headers['Content-Type'].
 */
var types = {
  'plain'     : 'text/plain; charset=utf-8',
  'json'      : 'application/json; charset=utf-8',
  'form'      : 'application/x-www-form-urlencoded; charset=utf-8'
}
exports.types = types

/**
 * Content-type checker regexes.
 */
var typeRegs = {
  'plain'     : /text\/plain/i,
  'json'      : /application\/json/i,
  'form'      : /application\/x-www-form-urlencoded/i
}
exports.typeRegs = typeRegs

/**
 * Checks if something is an object. As in, you can read properties from it and
 * set properties to it.
 */
function isObject (value) {
  return value !== null && typeof value === 'object'
}
exports.isObject = isObject

/**
 * `hasOwnProperty` that works for objects that don't have this method, like
 * hash tables created with Object.create(null)
 */
function ownProp (object, key) {
  return Object.hasOwnProperty.call(object, key)
}
exports.ownProp = ownProp

/**
 * Loops over own enumerable properties of an object, calling the callback on
 * each value with own execution context. Call this function with .call or
 * .apply to use a different execution context.
 */
function forOwn (object, callback) {
  if (!isObject(object)) return

  for (var key in object) {
    if (!ownProp(object, key)) continue

    callback.call(this, object[key], key)
  }
}
exports.forOwn = forOwn

/**
 * Assigns own enumerable properties of the given source object to the given
 * target object. If the target is not an object, a new empty object is used in
 * its place. Returns the target object.
 */
function assign (target, source) {
  if (!isObject(target)) target = {}
  if (!isObject(source)) return target

  forOwn(source, function (value, key) {
    target[key] = value
  })

  return target
}
exports.assign = assign

/**
 * Makes sure value is an object and makes a shallow clone.
 */
function toHash (object) {
  if (!isObject(object)) return {}

  var buffer = {}

  forOwn(object, function (value, key) {
    buffer[key] = value
  })

  return buffer
}
exports.toHash = toHash

/**
 * Converts a given hash into a query string. Ignores non-truthy values (except
 * zero) and non-truthy keys like ''. Useable for URLs or form-encoded URL
 * bodies. Always returns a string.
 */
function formEncode (object) {
  var result = []

  // Form key-value pairs, encoding each key and value
  forOwn(object, function (value, key) {
    if (!value && value !== 0 || !key) return
    result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
  })

  return result.join('&')
}
exports.formEncode = formEncode

},{}],8:[function(require,module,exports){
'use strict'

/**
 * Basic ajax utility. Does "low"-level browser ajax with ES6 promises and
 * provides a primitive API for request / response / error interceptors.
 *
 * Expects a CommonJS environment. Doesn't depend on jQuery.
 *
 * By default, the library uses an ES6-promise shim, but you can use any
 * spec-compliant Promise constructor by directly requiring this file and
 * calling the exported function with your constructor. Examples:
 *
 *   var xhttp = require('xhttp')
 *   var xhttp = require('xhttp/custom')(Promise)
 *   var xhttp = require('xhttp/custom')(require('q').Promise)
 *   var xhttp = require('xhttp/custom')(require('bluebird'))
 */

/******************************* Dependencies ********************************/

// Custom components
var Options = require('./options')
var utils   = require('./utils')
var parse   = require('./parse')

/**************************** Generator / Export *****************************/

/**
 * Export a function that takes a promise constructor and generates a version
 * of xhttp using it.
 */

module.exports = function (promiseConstructor) {

  // Check if the constructor has the methods we need
  var isPromise = typeof promiseConstructor === 'function' &&
                  typeof promiseConstructor.prototype.then  === 'function' &&
                  typeof promiseConstructor.prototype.catch === 'function'

  // Throw an error if we didn't get a constructor with the required methods
  if (!isPromise) {
    throw new Error('the argument must be a promise constructor')
  }

  /******************************** Utilities ********************************/

  /**
   * Checks if an xhr is successful. It's considered a success if the status is
   * between 200 and 299, inclusively.
   */
  function successful (xhr) {
    return xhr.status >= 200 && xhr.status <= 299
  }

  /**
   * Response handler. Parses the response, applies the given set of
   * interceptors, and returns the resulting response value that will be
   * passed to the resolver.
   */
  function parseResponse (xhr, interceptors) {
    /**
     * Special case for response status 204: the xhr response body isn't parsed,
     * isn't passed to interceptors, and interceptor return values are ignored.
     * See http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.2.5
     */

    if (xhr.status === 204) {
      interceptors.forEach(function (interceptor) {
        interceptor(null, xhr)
      })
      return null
    }

    /**
     * Standard case: the response is parsed in accordance with the xhr
     * options and content headers, then the interceptors are applied in
     * order. Each interceptor is called with the parsed response and the
     * native xhr object. If a non-undefined value is returned, it replaces
     * the response value for all subsequent callbacks.
     */

    var response = parse(xhr)

    interceptors.forEach(function (interceptor) {
      var result = interceptor(response, xhr)
      if (result !== undefined) response = result
    })

    // Return the parsed response
    return response
  }

  /********************************** xhttp **********************************/

  function xhttp (options) {
    return new promiseConstructor(function (resolve, reject) {

      // Parse the options into an options object
      options = new Options(options)

      // Make the new request object
      var xhr = new XMLHttpRequest()

      // Open with the given options
      xhr.open(
        options.method,
        options.url,
        true,  // always async
        options.username,
        options.password
      )

      /**
       * Apply request interceptors in order. Each interceptor is called with
       * one argument: the `data` attribute of the options object. If a
       * non-undefined value is returned, it replaces the data attribute.
       */
      if (!options.$noBody()) {
        xhttp.reqInterceptors.forEach(function (interceptor) {
          var result = interceptor(options.data)
          if (result !== undefined) options.data = result
        })
      }

      // Assign the headers
      utils.forOwn(options.headers, function (value, key) {
        xhr.setRequestHeader(key, value)
      })

      // Assign primitive options
      utils.assign(xhr, options.$simpleOptions())

      // Attach failure listeners
      xhr.onerror = xhr.onabort = xhr.ontimeout = function() {
        reject(parseResponse(xhr, xhttp.errInterceptors))
      }

      // Attach a success listener
      xhr.onload = function() {
        if (successful(xhr)) {
          resolve(parseResponse(xhr, xhttp.resInterceptors))
        } else {
          reject(parseResponse(xhr, xhttp.errInterceptors))
        }
      }

      // Send the request and let it trigger the callbacks
      xhr.send(options.data)
    })
  }

  /****************************** Interceptors *******************************/

  /**
   * `xhttp` has three groups of interceptors:
   *   reqInterceptors
   *   resInterceptors
   *   errInterceptors
   *
   * Request interceptors are called with `(data)`, where data is the data
   * passed in the xhttp config object supplied by the user. If an interceptor
   * returns a non-undefined value, the value replaces the data. If the request
   * method implies no body (like GET), request interceptors are ignored.
   *
   * Success and error interceptors are called with `(data, xhr)`, where data
   * is the parsed response and xhr is the native XMLHttpRequest object. Like
   * with request interceptors, they can replace the data by returning a
   * non-undefined value.
   */

  xhttp.reqInterceptors = []

  xhttp.resInterceptors = []

  xhttp.errInterceptors = []

  xhttp.addReqInterceptor = function (/* ... interceptors */) {
    xhttp.reqInterceptors.push.apply(xhttp.reqInterceptors, arguments)
  }

  xhttp.addResInterceptor = function (/* ... interceptors */) {
    xhttp.resInterceptors.push.apply(xhttp.resInterceptors, arguments)
  }

  xhttp.addErrInterceptor = function (/* ... interceptors */) {
    xhttp.errInterceptors.push.apply(xhttp.errInterceptors, arguments)
  }

  /******************************** "Export" *********************************/

  return xhttp

}

},{"./options":5,"./parse":6,"./utils":7}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libComponentsCarousel = require('./lib/components/Carousel');

var _libComponentsCarousel2 = _interopRequireDefault(_libComponentsCarousel);

var _libComponentsHeader = require('./lib/components/Header');

var _libComponentsHeader2 = _interopRequireDefault(_libComponentsHeader);

var _libComponentsProduct = require('./lib/components/Product');

var _libComponentsProduct2 = _interopRequireDefault(_libComponentsProduct);

var _libComponentsProductList = require('./lib/components/ProductList');

var _libComponentsProductList2 = _interopRequireDefault(_libComponentsProductList);

var _libComponentsAddToCart = require('./lib/components/AddToCart');

var _libComponentsAddToCart2 = _interopRequireDefault(_libComponentsAddToCart);

var _libComponentsComponent = require('./lib/components/Component');

var _libComponentsComponent2 = _interopRequireDefault(_libComponentsComponent);

var ui = {
    carousel: _libComponentsCarousel2['default'],
    header: _libComponentsHeader2['default'],
    component: _libComponentsComponent2['default'],
    productList: _libComponentsProductList2['default'],
    addToCart: _libComponentsAddToCart2['default'],
    baseProduct: _libComponentsProduct2['default']
};
exports.ui = ui;

},{"./lib/components/AddToCart":18,"./lib/components/Carousel":20,"./lib/components/Component":21,"./lib/components/Header":22,"./lib/components/Product":23,"./lib/components/ProductList":24}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = Evented;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _eventDispatcher = require('../event/Dispatcher');

var _eventDispatcher2 = _interopRequireDefault(_eventDispatcher);

var _utilEventUtils = require('../util/EventUtils');

var _utilDOMUtils = require('../util/DOMUtils');

var _utilGuid = require('../util/Guid');

var _utilGuid2 = _interopRequireDefault(_utilGuid);

var _eventNEvent = require('../event/nEvent');

var _eventNEvent2 = _interopRequireDefault(_eventNEvent);

function Evented() {}

;

Object.assign(Evented.prototype, {
    on: function on(event, handler, delegate) {
        var d = delegate || this.el || this;
        if ((0, _utilEventUtils.isNativeEvent)(event)) {
            return (0, _utilEventUtils.addHandler)(d, event, handler);
        }

        return this.subscribe(event, handler, d);
    },

    off: function off(event, handler, delegate) {
        if ((0, _utilEventUtils.isNativeEvent)(event)) {
            var d = delegate || this.el || this;
            return (0, _utilEventUtils.removeHandler)(d, event, handler);
        }
        return this.unsubscribe(event, handler);
    },

    once: function once(event, handler, delegate) {
        var that = this;

        function on(data, args) {
            //console.log('ONCE called:', subscription, handler);
            that.off(event, on, delegate);
            handler(data, args);
        }

        on.sId = (0, _utilGuid2['default'])();
        //console.log('attaching ONCE:', subscription, handler);
        var subscription = this.on(event, on, delegate);
        return subscription;
    },

    /**
     * Triggers DOM Events
     * @param eventName
     * @param element
     * @param data
     * @returns {*|boolean}
     */
    trigger: function trigger(eventName, element, data) {
        var E = undefined;
        if (!(0, _utilEventUtils.isNativeEvent)(eventName) && CustomEvent in window) {
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
    emit: function emit(eventName, data) {
        var el = this.el,
            elIsDOM = (0, _utilDOMUtils.isElement)(el) || (0, _utilDOMUtils.isNode)(el),
            native = (0, _utilEventUtils.isNativeEvent)(eventName),
            subscribers = this.mediator.subscribers;

        if (native && elIsDOM) {
            return this.trigger(eventName, el);
        }

        if (subscribers.has(eventName)) {
            //console.log('PUBSUB');
            var payload = new _eventNEvent2['default'](eventName, data, this);

            for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                args[_key - 2] = arguments[_key];
            }

            return this.mediator.dispatch(eventName, payload, args);
        }

        return false;
    },

    subscribe: function subscribe(channel, handler, context) {
        var ctx = context,
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

    unsubscribe: function unsubscribe(channel, handler) {
        var _this = this;

        var ret = [];
        try {
            ret = this.subscriptions.filter(function (sub) {
                //console.log('unsub:', channel, handler, sub.id);
                return sub.evt === channel && handler.sId === sub.id;
            }).map(function (hit) {
                var id = hit.id;
                ret = _this.mediator.remove(channel, id);
                _this.subscriptions.splice(id, 1);
            });
        } catch (e) {
            console.error('Failed to unsubscribe from channel ' + channel, e);
        }
        return ret;
    }
});

Evented.prototype.mediator = (0, _eventDispatcher2['default'])();
module.exports = exports['default'];

},{"../event/Dispatcher":27,"../event/nEvent":29,"../util/DOMUtils":30,"../util/EventUtils":31,"../util/Guid":32}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Initializable = {
    initState: function initState() {
        return this;
    },

    initProps: function initProps(props) {
        this.options = {};
        Object.assign(this.options, props);
        return this;
    }
};

exports["default"] = Initializable;
module.exports = exports["default"];

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _eventRegistry = require('../event/Registry');

var _eventRegistry2 = _interopRequireDefault(_eventRegistry);

var _utilDefaults = require('../util/defaults');

var _utilDefaults2 = _interopRequireDefault(_utilDefaults);

var Progressable = {
    showProgress: function showProgress() {
        var _this = this;

        if (!this.el || !this.emit) return false;

        this.el.classList.add('loading');
        this.emit(_eventRegistry2['default'].PROGRESS_START);
        this.progressId = window.setInterval(function () {
            var progress = _this.el.querySelector('progress');
            if (progress) {
                var value = parseInt(progress.getAttribute('value'), 10);
                progress.setAttribute('value', value + _utilDefaults2['default'].anyIntBetween(1, 10));
            } else {
                window.clearInterval(_this.progressId);
                throw new Error('<progress> element not found in component DOM.');
            }
        }, 200);
        return this;
    },

    done: function done() {
        if (!this.el || !this.progressId) return false;

        window.clearInterval(this.progressId);
        this.el.classList.remove('loading');
        return this;
    }
};

exports['default'] = Progressable;
module.exports = exports['default'];

},{"../event/Registry":28,"../util/defaults":34}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _behaviorsEvented = require('../../behaviors/Evented');

var _behaviorsEvented2 = _interopRequireDefault(_behaviorsEvented);

var _core = require('../../core');

var _classesModelsModel = require('../../classes/models/Model');

var _classesModelsModel2 = _interopRequireDefault(_classesModelsModel);

var _behaviorsInitializable = require('../../behaviors/Initializable');

var _behaviorsInitializable2 = _interopRequireDefault(_behaviorsInitializable);

var _utilMixes = require('../../util/mixes');

var _utilMixes2 = _interopRequireDefault(_utilMixes);

var _eventRegistry = require('../../event/Registry');

var _eventRegistry2 = _interopRequireDefault(_eventRegistry);

var overrides = {
    initProps: function initProps() {
        var models = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        this.options = {};
        Object.assign(this.options, options);
        this.model = options.model ? options.model : _classesModelsModel2['default'];
        this.models = [];
        this.parse(models);
    }
};

var Collection = (function () {
    function Collection() {
        var models = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, _Collection);

        this.initProps(models, options);
        this.initState();
    }

    _createClass(Collection, [{
        key: 'parse',
        value: function parse(data) {
            //console.log('incoming model data:', data, Object.getOwnPropertyNames(data), data.length);
            try {
                if (data.length) {
                    if (data[0] instanceof this.model) {
                        this.models = data;
                    } else {
                        var item = undefined;
                        for (item in data) {
                            if (data.hasOwnProperty(item)) {
                                var m = new this.model(data[item]);
                                //console.log('new model:', m, item, 'data:', data[item]);
                                this.models.push(m);
                            }
                        }
                    }
                }
            } catch (e) {
                console.error(e);
                throw e;
            }

            return this;
        }
    }, {
        key: 'serialize',
        value: function serialize() {
            return this.models.map(function (model) {
                return model.serialize();
            });
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {
            return JSON.stringify(this.models.map(function (model) {
                return model.serialize();
            }), null, 0);
        }
    }, {
        key: 'toMeta',
        value: function toMeta(transformer, options) {
            return JSON.stringify(transformer.collection(this.models.map(function (model) {
                return transformer.model(model.serialize());
            }), options), null, 0);
        }

        /**
         * returns an A+ promise
         * @param options
         * @returns {*}
         */
    }, {
        key: 'fetch',
        value: function fetch(options) {
            this.emit(_eventRegistry2['default'].BEFORE_FETCH);
            //console.log('fetch:', options);
            return _core.net.http.get.call(this, options);
        }
    }, {
        key: 'get',
        value: function get(options) {
            return this.fetch(options).then(this.parse.bind(this), this.onParseFailed.bind(this), 'collection.fetch');
        }
    }, {
        key: 'onParseFailed',
        value: function onParseFailed() {
            console.error('Parsing Failed.', this, arguments);
            return false;
        }
    }]);

    var _Collection = Collection;
    Collection = (0, _utilMixes2['default'])(_behaviorsEvented2['default'], _behaviorsInitializable2['default'], overrides)(Collection) || Collection;
    return Collection;
})();

exports['default'] = Collection;

Collection.model = _classesModelsModel2['default'];
module.exports = exports['default'];

},{"../../behaviors/Evented":10,"../../behaviors/Initializable":11,"../../classes/models/Model":15,"../../core":26,"../../event/Registry":28,"../../util/mixes":35}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Collection2 = require('./Collection');

var _Collection3 = _interopRequireDefault(_Collection2);

var _classesModelsProduct = require('../../classes/models/Product');

var _classesModelsProduct2 = _interopRequireDefault(_classesModelsProduct);

var ProductCollection = (function (_Collection) {
    _inherits(ProductCollection, _Collection);

    function ProductCollection() {
        _classCallCheck(this, ProductCollection);

        _get(Object.getPrototypeOf(ProductCollection.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(ProductCollection, [{
        key: 'initProps',
        value: function initProps() {
            var models = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            _get(Object.getPrototypeOf(ProductCollection.prototype), 'initProps', this).call(this, models, options);
            this.model = options.model ? options.model : _classesModelsProduct2['default'];
            return this;
        }
    }]);

    return ProductCollection;
})(_Collection3['default']);

exports['default'] = ProductCollection;
module.exports = exports['default'];

},{"../../classes/models/Product":16,"./Collection":13}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _core = require('../../core');

var _behaviorsEvented = require('../../behaviors/Evented');

var _behaviorsEvented2 = _interopRequireDefault(_behaviorsEvented);

var _utilGuidJs = require('../../util/Guid.js');

var _utilGuidJs2 = _interopRequireDefault(_utilGuidJs);

var _behaviorsInitializable = require('../../behaviors/Initializable');

var _behaviorsInitializable2 = _interopRequireDefault(_behaviorsInitializable);

var _utilMixes = require('../../util/mixes');

var _utilMixes2 = _interopRequireDefault(_utilMixes);

var _eventRegistry = require('../../event/Registry');

var _eventRegistry2 = _interopRequireDefault(_eventRegistry);

var attributes = {
    id: null,
    _guid: (0, _utilGuidJs2['default'])(),
    all: function all() {
        var _this = this;

        var values = {};
        Object.keys(this).map(function (p) {
            values[p] = _this[p];
        });

        return values;
    }
};

var overrides = {
    initProps: function initProps(props) {
        this.values = Object.create(attributes);

        Object.assign(this.values, this.defaults || {});

        if (props) {
            this.parse(props);
        }
        return this;
    }
};

var Model = (function () {
    function Model(props, options) {
        _classCallCheck(this, _Model);

        _behaviorsInitializable2['default'].initProps.call(this, options);
        this.initProps(props);
        this.initState();
    }

    _createClass(Model, [{
        key: 'setId',
        value: function setId(val) {
            var id = Number(val);
            if (!isNaN(id)) {
                this.values.id = id;
            } else {
                throw new TypeError('ID attribute value must be a number.');
            }
        }

        /**
         * returns an A+ promise
         * @param options
         * @returns {*}
         */
    }, {
        key: 'fetch',
        value: function fetch(options) {
            try {
                this.emit(_eventRegistry2['default'].BEFORE_FETCH);
                return _core.net.http.get.call(this, options);
            } catch (e) {
                console.error(e);
                //throw e;
            }
        }
    }, {
        key: 'parse',
        value: function parse(data) {
            //console.log('parsing model', data, Object.keys(data).length);
            try {
                if (Object.keys(data).length > 0) {
                    for (var prop in data) {
                        if (data.hasOwnProperty(prop)) {
                            this.set(prop, data[prop]);
                        }
                    }
                } else {
                    throw new Error('Data has zero length.');
                }
            } catch (e) {
                console.error(e);
                //throw e;
            }

            return this;
        }
    }, {
        key: 'get',
        value: function get(propName) {
            try {
                var prop = this.values[propName];
                return typeof prop === 'function' ? prop.call(this) : prop;
            } catch (e) {
                console.error(e);
                throw new ReferenceError('Property `' + propName + '` not found in ' + this.constructor.name);
            }
        }
    }, {
        key: 'set',
        value: function set(propName, value) {
            if (propName.toLowerCase() === 'id') {
                this.setId(value);
            } else {
                this.values[propName] = value;
            }

            return this;
        }
    }, {
        key: 'serialize',
        value: function serialize() {
            return this.values.all();
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {
            return JSON.stringify(this.values.all(), null, 0);
        }
    }, {
        key: 'toMeta',
        value: function toMeta(transformer, options) {
            return JSON.stringify(transformer(this.values.all(), options), null, 0);
        }
    }]);

    var _Model = Model;
    Model = (0, _utilMixes2['default'])(_behaviorsEvented2['default'], _behaviorsInitializable2['default'], overrides)(Model) || Model;
    return Model;
})();

exports['default'] = Model;
exports.Model = Model;

},{"../../behaviors/Evented":10,"../../behaviors/Initializable":11,"../../core":26,"../../event/Registry":28,"../../util/Guid.js":32,"../../util/mixes":35}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Model2 = require('./Model');

var _Model3 = _interopRequireDefault(_Model2);

var Product = (function (_Model) {
    _inherits(Product, _Model);

    function Product() {
        _classCallCheck(this, Product);

        _get(Object.getPrototypeOf(Product.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(Product, [{
        key: 'initProps',
        value: function initProps() {
            this.defaults = {};
            _Model3['default'].prototype.initProps.apply(this, arguments);
            return this;
        }
    }]);

    return Product;
})(_Model3['default']);

exports['default'] = Product;
exports.ProductModel = Product;

},{"./Model":15}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _behaviorsEvented = require('../../behaviors/Evented');

var _behaviorsEvented2 = _interopRequireDefault(_behaviorsEvented);

var _behaviorsInitializable = require('../../behaviors/Initializable');

var _behaviorsInitializable2 = _interopRequireDefault(_behaviorsInitializable);

var _utilMixes = require('../../util/mixes');

var _utilMixes2 = _interopRequireDefault(_utilMixes);

var View = (function () {
    function View(options) {
        _classCallCheck(this, _View);

        _behaviorsInitializable2['default'].initProps.call(this, options);
    }

    _createClass(View, [{
        key: 'render',
        value: function render() {
            return this;
        }
    }, {
        key: 'bindSubscriptions',
        value: function bindSubscriptions() {
            return this;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            var ret = [];
            ret.push(this.detachEvents());
            return ret;
        }
    }, {
        key: 'detachEvents',
        value: function detachEvents() {
            var _this = this;

            if (this.subscriptions) {
                return this.subscriptions.map(function (subscription) {
                    //console.log('detaching event', this, subscription);
                    var evt = subscription.evt,
                        fn = subscription.fn;
                    return _this.off(evt, fn);
                });
            }
            return false;
        }
    }]);

    var _View = View;
    View = (0, _utilMixes2['default'])(_behaviorsEvented2['default'], _behaviorsInitializable2['default'])(View) || View;
    return View;
})();

exports['default'] = View;
module.exports = exports['default'];

},{"../../behaviors/Evented":10,"../../behaviors/Initializable":11,"../../util/mixes":35}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Component2 = require('./Component');

var _Component3 = _interopRequireDefault(_Component2);

var AddToCart = (function (_Component) {
    _inherits(AddToCart, _Component);

    function AddToCart() {
        _classCallCheck(this, AddToCart);

        _get(Object.getPrototypeOf(AddToCart.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(AddToCart, [{
        key: 'initProps',
        value: function initProps(el, options) {
            return _get(Object.getPrototypeOf(AddToCart.prototype), 'initProps', this).call(this, el, options);
        }
    }, {
        key: 'initState',
        value: function initState() {
            this.bindDOMEvents();
            return this;
        }
    }, {
        key: 'bindDOMEvents',
        value: function bindDOMEvents() {
            var _this = this;

            this.on('submit', this.onSubmit.bind(this));

            this.on('click', function (e) {
                console.log('CLICKED', _this, e);
            });

            return this;
        }
    }, {
        key: 'onSubmit',
        value: function onSubmit(e) {
            console.log('SUBMITTED', this, e);
            e.preventDefault();
            return false;
        }
    }]);

    return AddToCart;
})(_Component3['default']);

exports['default'] = AddToCart;
module.exports = exports['default'];

},{"./Component":21}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Component2 = require('./Component');

var _Component3 = _interopRequireDefault(_Component2);

var _Resolver = require('./Resolver');

var _Resolver2 = _interopRequireDefault(_Resolver);

var _eventRegistry = require('../event/Registry');

var _eventRegistry2 = _interopRequireDefault(_eventRegistry);

_Component3['default'].Resolver = new _Resolver2['default']();

var Application = (function (_Component) {
    _inherits(Application, _Component);

    function Application() {
        _classCallCheck(this, Application);

        _get(Object.getPrototypeOf(Application.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(Application, [{
        key: 'start',
        value: function start() {
            this.emit(_eventRegistry2['default'].APP_START);
            return this;
        }
    }, {
        key: 'attachPartials',
        value: function attachPartials() {
            return this.updateChildren('[data-partial]');
        }
    }]);

    return Application;
})(_Component3['default']);

exports['default'] = Application;
module.exports = exports['default'];

},{"../event/Registry":28,"./Component":21,"./Resolver":25}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _classesModelsModel = require('../classes/models/Model');

var _componentsComponent = require('../components/Component');

var _componentsComponent2 = _interopRequireDefault(_componentsComponent);

var Carousel = (function (_Component) {
    _inherits(Carousel, _Component);

    function Carousel() {
        _classCallCheck(this, Carousel);

        _get(Object.getPrototypeOf(Carousel.prototype), 'constructor', this).apply(this, arguments);

        this.model = _classesModelsModel.Model;
        this.id = 'ui/slider';
    }

    _createClass(Carousel, [{
        key: 'initState',
        value: function initState() {
            return this;
        }
    }, {
        key: 'initProps',
        value: function initProps(el, options) {
            _get(Object.getPrototypeOf(Carousel.prototype), 'initProps', this).call(this, el, options);
            this.model = options.model || new _classesModelsModel.Model();
            if (this.el.dataset.mounted === undefined) {
                this.template = options.template || document.querySelector(this.getComponentSelector());
            }
            return this;
        }
    }, {
        key: 'render',
        value: function render() {
            try {
                this.attachNestedComponents();
                return this;
            } catch (e) {
                console.error(e);
                throw e;
            }
        }
    }]);

    return Carousel;
})(_componentsComponent2['default']);

exports['default'] = Carousel;
module.exports = exports['default'];

},{"../classes/models/Model":15,"../components/Component":21}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _classesViewsView = require('../classes/views/View');

var _classesViewsView2 = _interopRequireDefault(_classesViewsView);

var _classesModelsModel = require('../classes/models/Model');

var _classesModelsModel2 = _interopRequireDefault(_classesModelsModel);

var _classesCollectionsCollection = require('../classes/collections/Collection');

var _classesCollectionsCollection2 = _interopRequireDefault(_classesCollectionsCollection);

var _utilDOMUtils = require('../util/DOMUtils');

var _utilLookupTable = require('../util/LookupTable');

var _utilLookupTable2 = _interopRequireDefault(_utilLookupTable);

var _eventRegistry = require('../event/Registry');

var _eventRegistry2 = _interopRequireDefault(_eventRegistry);

var _utilDefaults = require('../util/defaults');

var _utilDefaults2 = _interopRequireDefault(_utilDefaults);

var _behaviorsProgressable = require('../behaviors/Progressable');

var _behaviorsProgressable2 = _interopRequireDefault(_behaviorsProgressable);

var _utilMixes = require('../util/mixes');

var _utilMixes2 = _interopRequireDefault(_utilMixes);

var Component = (function (_View) {
    _inherits(Component, _View);

    function Component(el) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, _Component);

        _get(Object.getPrototypeOf(_Component.prototype), 'constructor', this).call(this, options);
        this.componentAttr = 'data-component';
        this.initProps(el, options);
    }

    _createClass(Component, [{
        key: 'initProps',
        value: function initProps(el, options) {
            this.ensureElement(el);
            this.id = this.options.id || this.generateComponentId();
            this.model = new _classesModelsModel2['default'](this.options.model);
            this.collection = new _classesCollectionsCollection2['default'](this.options.collection);
            this.template = this.options.template || null;
            this.childViews = Object.create(_utilLookupTable2['default']);
            this.initState();
        }
    }, {
        key: 'generateComponentId',
        value: function generateComponentId() {
            return new Date().getTime();
        }
    }, {
        key: 'ensureElement',
        value: function ensureElement(el) {
            try {
                this.el = (0, _utilDOMUtils.isElement)(el) ? el : Component.reservedElements.indexOf(el.toUpperCase()) !== -1 ? document.getElementsByTagName(el)[0] : document.createElement(el || Component.defaults.el);
                return true;
            } catch (e) {
                console.error(e);
                throw new Error('Component must have a DOMElement.', e);
            }
        }
    }, {
        key: 'getComponentAttrSelector',
        value: function getComponentAttrSelector() {
            return '[' + this.componentAttr + ']';
        }
    }, {
        key: 'findComponents',
        value: function findComponents() {
            return this.el.querySelectorAll(this.getComponentAttrSelector());
        }
    }, {
        key: 'getComponentSelector',
        value: function getComponentSelector() {
            return '[' + this.componentAttr + '="' + this.getComponentId() + '"]';
        }
    }, {
        key: 'getComponentId',
        value: function getComponentId() {
            return this.id;
        }
    }, {
        key: 'getBootstrap',
        value: function getBootstrap() {
            if (window.e750.bootstrap) {
                return window.e750.bootstrap[this.constructor.name] || [];
            }
            return [];
        }
    }, {
        key: 'isMounted',
        value: function isMounted() {
            var components = this.id ? this.findComponents() : this.el.children;
            if (components.length) {
                var _ret = (function () {
                    var list = [];
                    [].forEach.call(components, function (component) {
                        list.push(component.dataset.mounted);
                    });
                    return {
                        v: !!list.indexOf(false)
                    };
                })();

                if (typeof _ret === 'object') return _ret.v;
            }
            return false;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            var ret = [];
            Object.keys(this.childViews, function (view) {
                //console.log('removing child view: ', view);
                ret.push(view.destroy());
            });
            return ret.push([_get(Object.getPrototypeOf(_Component.prototype), 'destroy', this).call(this), this.unmount()]);
        }
    }, {
        key: 'unmount',
        value: function unmount() {
            var el = this.el,
                parent = el.parentElement;
            if (!parent) {
                return true; //not in DOM;
            }
            try {
                return parent.removeChild(this.el);
            } catch (e) {
                console.error('Unable to unmount View.', e);
                return false;
            }
        }
    }, {
        key: 'addChildView',
        value: function addChildView(view) {
            var componentId = Component.Resolver.getComponentId(view),
                childViews = this.childViews;
            if (!childViews.has(componentId)) {
                childViews[componentId] = [];
            }
            childViews[componentId].push(view);
            return this;
        }
    }, {
        key: 'bindDOMEvents',
        value: function bindDOMEvents() {
            return this;
        }
    }, {
        key: 'attachNestedComponents',
        value: function attachNestedComponents() {
            return this.updateChildren(this.getComponentAttrSelector());
        }
    }, {
        key: 'updateChildren',
        value: function updateChildren(selector) {
            var _this = this;

            var components = selector ? this.el.querySelectorAll(selector) : this.el.children,
                Resolver = Component.Resolver;

            //console.log('registering child components for: ', this, components, selector, this.el.querySelectorAll(selector), this.el.children);

            if (components.length) {
                this.emit(_eventRegistry2['default'].WILL_UPDATE_CHILDREN);
                try {
                    [].filter.call(components, function (node) {
                        return node.dataset.component;
                    });
                } catch (e) {
                    console.error(e);
                    throw e;
                }

                try {
                    //console.log('components: ', components, this, this.childViews);
                    [].forEach.call(components, function (componentEl) {
                        var componentId = componentEl.dataset.component;
                        if (!_this.childViews.has(componentId)) {
                            _this.childViews[componentId] = [];
                        }
                        if (Resolver.has(componentId)) {
                            var C = Resolver.get(componentId),
                                c = new C(componentEl, componentEl.dataset.options);
                            _this.childViews[componentId].push(c);
                            //console.info('registered component: ', componentId, componentEl, C);
                        } else {
                                throw new ReferenceError(componentId + ' not found in component resolver.', Resolver);
                            }
                    });
                    this.emit(_eventRegistry2['default'].DID_UPDATE_CHILDREN);
                } catch (e) {
                    console.error(e);
                    throw e;
                }
            } else {
                console.info('No child components to register.');
            }

            this.emit(_eventRegistry2['default'].COMPONENTS_LOADED);
            return this;
        }
    }]);

    var _Component = Component;
    Component = (0, _utilMixes2['default'])(_behaviorsProgressable2['default'])(Component) || Component;
    return Component;
})(_classesViewsView2['default']);

exports['default'] = Component;

Component.defaults = {
    el: 'div'
};

Component.reservedElements = ['HTML', 'HEAD', 'BODY'];
module.exports = exports['default'];

},{"../behaviors/Progressable":12,"../classes/collections/Collection":13,"../classes/models/Model":15,"../classes/views/View":17,"../event/Registry":28,"../util/DOMUtils":30,"../util/LookupTable":33,"../util/defaults":34,"../util/mixes":35}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _classesModelsModel = require('../classes/models/Model');

var _componentsComponent = require('../components/Component');

var _componentsComponent2 = _interopRequireDefault(_componentsComponent);

var Header = (function (_Component) {
    _inherits(Header, _Component);

    function Header() {
        _classCallCheck(this, Header);

        _get(Object.getPrototypeOf(Header.prototype), 'constructor', this).apply(this, arguments);

        this.model = _classesModelsModel.Model;
        this.id = 'ui/header';
    }

    _createClass(Header, [{
        key: 'initState',
        value: function initState() {
            return this;
        }
    }, {
        key: 'initProps',
        value: function initProps(el, options) {
            _get(Object.getPrototypeOf(Header.prototype), 'initProps', this).call(this, el, options);
            this.model = options.model || new _classesModelsModel.Model();
            if (this.el.dataset.mounted === undefined) {
                this.template = options.template || document.querySelector(this.getComponentSelector());
            }
            return this;
        }
    }, {
        key: 'render',
        value: function render() {
            try {
                this.attachNestedComponents();
                return this;
            } catch (e) {
                console.error(e);
                throw e;
            }
        }
    }]);

    return Header;
})(_componentsComponent2['default']);

exports['default'] = Header;
module.exports = exports['default'];

},{"../classes/models/Model":15,"../components/Component":21}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _core = require('../core');

var _classesModelsProduct = require('../classes/models/Product');

var _componentsComponent = require('../components/Component');

var _componentsComponent2 = _interopRequireDefault(_componentsComponent);

var Product = (function (_Component) {
    _inherits(Product, _Component);

    function Product() {
        _classCallCheck(this, Product);

        _get(Object.getPrototypeOf(Product.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(Product, [{
        key: 'initProps',
        value: function initProps(el, options) {
            _get(Object.getPrototypeOf(Product.prototype), 'initProps', this).call(this, el, options);
            this.model = options.model || new _classesModelsProduct.ProductModel();
            if (this.el.dataset.mounted === undefined) {
                this.template = options.template || _core.jst.getFromDOM('product/simple');
            }
            return this;
        }
    }, {
        key: 'render',
        value: function render() {
            try {
                //console.log('render product', this.model.serialize());
                if (this.el.dataset.mounted === undefined) {
                    this.el = _core.jst.compile(this.template, this.model.serialize());
                }
                this.attachNestedComponents();
                return this;
            } catch (e) {
                console.error(e);
                throw e;
            }
        }
    }]);

    return Product;
})(_componentsComponent2['default']);

exports['default'] = Product;
module.exports = exports['default'];

},{"../classes/models/Product":16,"../components/Component":21,"../core":26}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Component2 = require('./Component');

var _Component3 = _interopRequireDefault(_Component2);

var _Product = require('./Product');

var _Product2 = _interopRequireDefault(_Product);

var _classesCollectionsProduct = require('../classes/collections/Product');

var _classesCollectionsProduct2 = _interopRequireDefault(_classesCollectionsProduct);

var ProductList = (function (_Component) {
    _inherits(ProductList, _Component);

    function ProductList() {
        _classCallCheck(this, ProductList);

        _get(Object.getPrototypeOf(ProductList.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(ProductList, [{
        key: 'initState',
        value: function initState() {
            this.collection = new _classesCollectionsProduct2['default'](this.getBootstrap());

            //console.log('PRODUCT LIST:', this.collection.models, window.e750.bootstrap.productList);
            if (!this.collection.models.length) {
                var defaults = {
                    url: '/api/products/',
                    type: 'json',
                    method: 'GET',
                    headers: {
                        'X-Auth-Token': document.cookie.split('=')[1]
                    }
                },
                    fetchOpts = {};

                Object.assign(fetchOpts, defaults, this.options);
                this.loadData(fetchOpts);
            } else {
                this.render();
            }
            return this;
        }
    }, {
        key: 'loadData',
        value: function loadData(fetchOpts) {
            var _this = this,
                _arguments2 = arguments;

            this.showProgress();
            this.collection.get(fetchOpts).then(this.render.bind(this), function (reason) {
                console.error('Render Failed! ', _this, _arguments2, reason);
            })['catch'](function (reason) {
                console.error('Promise Rejected! ', _this, _arguments2, reason);
            })['finally'](function () {
                //console.log('finally', this, arguments, this.options);
                _this.done();
            });
            return this;
        }
    }, {
        key: 'bindDOMEvents',
        value: function bindDOMEvents() {
            this.on('dblclick', function () {
                console.log('double clicked!');
            });
            return this;
        }
    }, {
        key: 'render',
        value: function render() {
            if (!this.isMounted()) {
                try {
                    var html = '',
                        products = this.collection.models,
                        product = undefined;
                    for (var i = 0; i < products.length; i++) {
                        var model = products[i];
                        model.set('quantities', window.e750.FIXTURES.quantities);
                        product = new _Product2['default']('div', { model: model });
                        product.render();
                        this.addChildView(product);
                        html += product.el.outerHTML;
                    }

                    this.el.innerHTML = html;
                    this.bindDOMEvents();
                    this.attachNestedComponents();
                } catch (e) {
                    throw e;
                }
            }
            return this;
        }
    }]);

    return ProductList;
})(_Component3['default']);

exports['default'] = ProductList;
module.exports = exports['default'];

},{"../classes/collections/Product":14,"./Component":21,"./Product":23}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = Resolver;

var _cart = require('../../cart');

function Resolver() {}

Resolver.prototype.registry = {
    'ui/header': _cart.ui.header,
    'ui/slider': _cart.ui.carousel,
    'ui/intro': _cart.ui.component,
    'cart/add': _cart.ui.addToCart,
    'cart/product-list': _cart.ui.productList,
    'cart/product/simple': _cart.ui.baseProduct
};

Resolver.prototype.getComponentId = function (view) {
    var _this = this;

    return Object.getOwnPropertyNames(this.registry).filter(function (componentId) {
        return Object.getPrototypeOf(view).constructor === _this[componentId];
    })[0] || null;
};

Resolver.prototype.register = function () {
    if (arguments.length === 1 && typeof arguments[0] === 'object') {
        var c = undefined;
        for (c in arguments[0]) {
            this.registry[c] = arguments[0][c];
        }
    } else {
        this.registry[arguments[0]] = arguments[1];
    }
    return this;
};

Resolver.prototype.unregister = function (name) {
    delete this.registry[name];
    return this;
};

Resolver.prototype.has = function (component) {
    return this.registry[component];
};

Resolver.prototype.get = function (component) {
    return this.has(component) ? this.registry[component] : null;
};
module.exports = exports['default'];

},{"../../cart":9}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var _arguments = arguments;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _templeton = require('templeton');

var _templeton2 = _interopRequireDefault(_templeton);

var _behaviorsEvented = require('./behaviors/Evented');

var _behaviorsEvented2 = _interopRequireDefault(_behaviorsEvented);

var _utilDOMUtils = require('./util/DOMUtils');

var _rsvp = require('rsvp');

var _rsvp2 = _interopRequireDefault(_rsvp);

var _eventRegistry = require('./event/Registry');

var _eventRegistry2 = _interopRequireDefault(_eventRegistry);

var xhttp = require('xhttp/custom')(_rsvp2['default'].Promise);

var net = {
    http: {
        /**
         * Base NET request function
         * returns an A+ promise
         * @param options
         * @returns {*}
         */
        ajax: function ajax(options) {
            var defaults = {
                method: 'GET'
            };

            Object.assign(defaults, options);
            this.emit(_eventRegistry2['default'].BEFORE_AJAX, options);
            return xhttp(options);
        },
        /**
         * Alias for an ASYNC HTTP GET
         * returns an A+ promise
         * @param options
         * @returns {*}
         */
        get: function get(options) {
            options.method = 'GET';
            return net.http.ajax.call(this, options);
        }
    }
};

exports.net = net;
var storage = {

    cookie: function cookie(name, value, options) {

        function encode(val) {
            try {
                return encodeURIComponent(val);
            } catch (e) {
                return null;
            }
        }

        function decode(val) {
            try {
                return decodeURIComponent(val);
            } catch (e) {
                return null;
            }
        }

        function set(key, val) {
            var opts = arguments[2] === undefined ? {} : arguments[2];

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

        function get(key) {
            var cookies = parse(document.cookie);
            return !!key ? cookies[key] : cookies;
        }

        function parse(str) {
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
                    if (!_iteratorNormalCompletion && _iterator['return']) {
                        _iterator['return']();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return obj;
        }

        if (_arguments.length < 2) {
            return get(name);
        }

        set(name, value, options);
    }
};

exports.storage = storage;
var jst = {
    templates: {},

    getFromDOM: function getFromDOM(name) {
        return document.getElementById(name).innerHTML;
    },

    compile: function compile(templateStr, data, overrides) {
        return (0, _utilDOMUtils.htmlToDom)(_templeton2['default'].template(templateStr, data, overrides));
    }

};

exports.jst = jst;
exports['default'] = { net: net, storage: storage, jst: jst };

},{"./behaviors/Evented":10,"./event/Registry":28,"./util/DOMUtils":30,"rsvp":2,"templeton":3,"xhttp/custom":4}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = Dispatcher;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilGuid = require('../util/Guid');

var _utilGuid2 = _interopRequireDefault(_utilGuid);

var _utilLookupTable = require('../util/LookupTable');

var _utilLookupTable2 = _interopRequireDefault(_utilLookupTable);

function Dispatcher() {
    if (!(this instanceof Dispatcher)) {
        return new Dispatcher();
    }

    this.subscribers = Object.create(_utilLookupTable2['default']);
}

function addSubscriber(channel, handler) {
    var subscriptionId = handler.sId || (0, _utilGuid2['default'])(),
        subs = this.subscribers,
        ret = undefined;
    if (!subs.has(channel)) {
        subs[channel] = Object.create(_utilLookupTable2['default']);
    }
    handler.sId = subscriptionId;
    subs[channel][subscriptionId] = handler;
    ret = { evt: channel, id: subscriptionId, fn: handler };
    return ret;
}

function removeSubscriber(channel, subscriberId) {
    var subs = this.subscribers;

    if (subs.has(channel) && subs[channel].has(subscriberId)) {
        delete subs[channel][subscriberId];
        return subscriberId;
    }
    return false;
}

function removeChannel(channel) {
    var subs = this.getSubscribers(channel);

    if (subs.has(channel)) {
        delete subs[channel];
        return true;
    }
    return false;
}

function getSubscribers(channel) {
    if (!this.subscribers.has(channel)) {
        return Object.create(_utilLookupTable2['default']);
    }
    var all = this.subscribers;

    return all[channel];
}

function dispatch(channel, payload, args) {
    var channelSubs = this.getSubscribers(channel),
        recipient = undefined,
        responses = [];

    try {
        for (recipient in channelSubs.all()) {
            var handler = channelSubs[recipient],
                ret = undefined;

            //console.log('dispatch!', 'evt:', channel, 'rcp:', recipient, 'fn:', handler, 'data:', payload, 'args:', args);
            ret = handler(payload, args);
            responses.push(ret || 0);
        }
        //console.log('responses', responses);
    } catch (e) {
        console.error('Unable to dispatch event!', e);
    }
    return responses;
}

Dispatcher.prototype.add = addSubscriber;
Dispatcher.prototype.remove = removeSubscriber;
Dispatcher.prototype.removeChannel = removeChannel;
Dispatcher.prototype.getSubscribers = getSubscribers;
Dispatcher.prototype.dispatch = dispatch;
Dispatcher.prototype.subscribe = addSubscriber;
module.exports = exports['default'];

},{"../util/Guid":32,"../util/LookupTable":33}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var Registry = {
    APP_START: 'start',
    BEFORE_AJAX: 'beforeAjax',
    BEFORE_FETCH: 'beforeFetch',
    COMPONENTS_LOADED: 'componentsLoaded',
    BEFORE_RENDER: 'beforeRender',
    WILL_UPDATE_CHILDREN: 'willUpdateChildren',
    DID_UPDATE_CHILDREN: 'didUpdateChildren',
    PROGRESS_START: 'progress:start',
    PROGRESS_END: 'progress:end'
};
exports['default'] = Registry;
exports.Evt = Registry;

},{}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = nEvent;

function nEvent() {
    var type = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
    var data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var target = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    this.type = type;
    this.data = data;
    this.target = target;
    this.cancelled = false;
}

module.exports = exports['default'];

},{}],30:[function(require,module,exports){
/**
 * returns true if HTML Node
 * @param o
 * @returns Boolean
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.isNode = isNode;
exports.isElement = isElement;
exports.htmlToDom = htmlToDom;

function isNode(o) {
	return typeof Node === 'object' ? o instanceof Node : o && typeof o === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName === 'string';
}

/**
 * Returns true if DOM Elemebt
 * @param o
 * @returns Boolean
 */

function isElement(o) {
	return typeof HTMLElement === 'object' ? o instanceof HTMLElement : //DOM2
	o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string';
}

/**
 * Transforms an HTML string into DOM Elements
 * * strips <script> tags by default
 * @param HTMLString
 * @param stripScripts {Boolean}
 * @returns {Element}
 */

function htmlToDom(HTMLString) {
	var stripScripts = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

	var tmp = document.createElement('div');
	tmp.innerHTML = HTMLString;

	if (stripScripts) {
		var scripts = tmp.getElementsByTagName('script'),
		    i = scripts.length;
		while (i--) {
			scripts[i].parentNode.removeChild(scripts[i]);
		}
	}

	return tmp.firstElementChild;
}

exports['default'] = { isNode: isNode, isElement: isElement, htmlToDom: htmlToDom };

},{}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.manageNativeEvents = manageNativeEvents;
exports.isNativeEvent = isNativeEvent;
exports.addHandler = addHandler;
exports.removeHandler = removeHandler;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilGuid = require('../util/Guid');

var _utilGuid2 = _interopRequireDefault(_utilGuid);

/**
 * Cross-Browser event listener.
 *
 * @param addOrRemove {String}
 * @param obj {DOM Element or Node}
 * @param eventNames {String: list of events to listen for}
 * @param handler {Function}
 * @param useCapture {Boolean}
 */

function manageNativeEvents(addOrRemove, obj, eventNames, handler) {
    var useCapture = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];

    var i = 0,
        events = eventNames.split(' '),
        prefix = obj.addEventListener ? '' : 'on';

    try {
        return events.map(function () {
            var e = prefix + events[i],
                listenerId = undefined,
                addlistenerMethods = ['addEventListener', 'attachEvent'],
                ret = undefined;

            if (addlistenerMethods.indexOf(addOrRemove) !== -1) {
                listenerId = (0, _utilGuid2['default'])();
                handler.sId = listenerId;
            } else {
                //console.log('Removing DOM event:', e, handler);
                delete handler.sId;
            }
            obj[addOrRemove](e, handler, useCapture);
            ret = { evt: e, id: listenerId, fn: handler };
            return ret;
        });
    } catch (e) {
        console.error('Error attaching event listener', e, addOrRemove, obj, eventNames, handler);
        return false;
    }
}

/**
 * Determines if event is browser/device-native as opposed to a custom event
 * @param eventname
 * @returns {boolean}
 */

function isNativeEvent(eventname) {
    return typeof document.body['on' + eventname] !== 'undefined';
}

/**
 * Cross-browser addEventListener()
 * @param target
 * @param eventNames
 * @param handler
 */

function addHandler(target, eventNames, handler) {
    var bindType = target.addEventListener ? 'addEventListener' : 'attachEvent';
    return manageNativeEvents(bindType, target, eventNames, handler);
}

/**
 * Cross-browser removeEventListener()
 * @param target
 * @param eventNames
 * @param handler
 */

function removeHandler(target, eventNames, handler) {
    var bindType = target.removeEventListener ? 'removeEventListener' : 'detachEvent';
    return manageNativeEvents(bindType, target, eventNames, handler);
}

exports['default'] = { isNativeEvent: isNativeEvent, addHandler: addHandler, removeHandler: removeHandler };

},{"../util/Guid":32}],32:[function(require,module,exports){
/**
 * Generates an  RFC4122 version 4 compliant identifier.
 * @returns {string}
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = guid;

function guid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = Math.random() * 16 | 0,
		    v = c === 'x' ? r : r & 0x3 | 0x8;
		return v.toString(16);
	});
}

module.exports = exports['default'];

},{}],33:[function(require,module,exports){
/**
 * For your health!
 * @type {{has: *}}
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var LookupTable = {
    add: function add(name, value) {
        if (value === undefined) return false;

        if (this[name] === undefined) {
            // because 0, false and null are OK!
            this[name] = value;
            return true;
        } else {
            throw new ReferenceError('`' + name + '` already exists in lookup table.');
        }
    },
    remove: function remove(name) {
        if (this[name] !== undefined) {
            delete this[name];
            return true;
        } else {
            throw new ReferenceError('`' + name + '` does not exist in lookup table.');
        }
    },
    all: function all() {
        var p = undefined,
            values = {};
        for (p in this) {
            if (this.has(p)) {
                values[p] = this[p];
            }
        }
        return values;
    },
    toArray: function toArray() {
        var p = undefined,
            values = [];
        for (p in this) {
            if (this.has(p)) {
                values.push({ key: p, value: this[p] });
            }
        }
        return values;
    },
    reset: function reset() {
        for (var x in this) if (this.hasOwnProperty(x) && typeof x !== 'function') delete this[x];
        return true;
    }
};

Object.defineProperty(LookupTable, 'size', { value: function value() {
        return Object.keys(this).length;
    }, enumerable: false });
Object.defineProperty(LookupTable, 'has', { value: Object.prototype.hasOwnProperty, enumerable: false });

exports['default'] = LookupTable;
module.exports = exports['default'];

},{}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Guid = require('./Guid');

var _Guid2 = _interopRequireDefault(_Guid);

var _mixes = require('./mixes');

var _mixes2 = _interopRequireDefault(_mixes);

var Compose = function Compose() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    return function (initial) {
        return args.reduceRight(function (result, fn) {
            return fn(result);
        }, initial);
    };
};

/**
 *  Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
var anyIntBetween = function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports['default'] = { Compose: Compose, mixes: _mixes2['default'], guid: _Guid2['default'], anyIntBetween: anyIntBetween };
module.exports = exports['default'];

},{"./Guid":32,"./mixes":35}],35:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = mixes;

function mixes() {
	for (var _len = arguments.length, behaviors = Array(_len), _key = 0; _key < _len; _key++) {
		behaviors[_key] = arguments[_key];
	}

	return function (target) {
		return behaviors.forEach(function (behavior) {
			var b = behavior.prototype || behavior;

			Object.assign(target.prototype, b);
		});
	};
}

module.exports = exports["default"];

},{}],36:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _comE750LibComponentsApplication = require('./com.e750/lib/components/Application');

var _comE750LibComponentsApplication2 = _interopRequireDefault(_comE750LibComponentsApplication);

var app_version = '0.0.1';

var e750 = (function (_Application) {
    _inherits(e750, _Application);

    function e750(rootNode, options) {
        _classCallCheck(this, e750);

        _get(Object.getPrototypeOf(e750.prototype), 'constructor', this).call(this, rootNode, options);

        this.bootstrap(options.FIXTURES || {});
    }

    _createClass(e750, [{
        key: 'start',
        value: function start() {
            //console.log('app init():', this, arguments);
            //console.log('cookies:', document.cookie);
            console.info('E750.js v' + app_version);
            this.attachNestedComponents();
            //TODO: implement this
            //this.attachPartials();
        }
    }, {
        key: 'bootstrap',
        value: function bootstrap() {
            var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            this.fixtures = data;
        }
    }]);

    return e750;
})(_comE750LibComponentsApplication2['default']);

var app = new e750('body', { fixtures: window.e750.FIXTURES, options: window.e750.options || {} });
document.addEventListener('DOMContentLoaded', app.start.bind(app));

},{"./com.e750/lib/components/Application":19}]},{},[36]);

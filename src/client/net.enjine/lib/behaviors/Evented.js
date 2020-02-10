import Dispatcher from "lib/event/Dispatcher";
import {
  isNativeEvent as isNative,
  addHandler,
  removeHandler,
  eventPathContains
} from "lib/event/utils";
import { isElement, isNode, elementMatchesSelector } from "lib/util/DOM";
import guid from "lib/util/guid";
import nEvent from "lib/event/nEvent";

export default function Evented() {}

Object.assign(Evented.prototype, {
  /**
   * Delegate an event handler to child elements matching the selector
   *
   * @param evTarget
   * @param eventNames
   * @param handler
   * @param context
   * @returns {delegate}
   */
  delegate: function(selector, eventNames, handler, context) {
    let ctx = context || this;

    function wrap(e) {
      let target = e.target || e.srcElement;
      if (
        target &&
        (eventPathContains(e, selector) ||
          elementMatchesSelector(target, selector))
      ) {
        return handler.apply(ctx, arguments);
      }
      return false;
    }

    wrap.originalHandler = handler;

    return this.on(eventNames, wrap);
  },

  /**
   * Delegate an event handler to child elements matching the selector
   * and remove the event listener after the callback is invoked
   *
   * @param evTarget
   * @param eventNames
   * @param handler
   * @param context
   * @returns {delegateOnce}
   */
  delegateOnce: function(selector, eventNames, handler, context) {
    let ctx = context || this,
      that = this;

    function cb(e) {
      let target = e.target || e.srcElement;
      if (
        target &&
        (eventPathContains(e, selector) ||
          elementMatchesSelector(target, selector))
      ) {
        that.off(eventNames, cb);
        return handler.apply(ctx, arguments);
      }
      return false;
    }

    return this.on(eventNames, cb);
  },

  /**
   * Inversion of control, a.k.a `delegate` for objects.
   * Enables event delegation on objects rather than DOM elements.
   * @param obj
   * @param event
   * @param handler
   * @param context
   * @returns {*}
   */
  listenTo: function(obj, event, handler, context) {
    let ctx = context || this;
    return this.on(event, function(e) {
      let target = e.target || e.srcElement;
      if (target && target === obj) {
        return handler.apply(ctx, arguments);
      }
      return false;
    });
  },

  /**
   * Inversion of control, a.k.a `delegate` for objects.
   * Enables event delegation on objects rather than DOM elements.
   * Removes the listener after it is invoked once.
   *
   * @param obj
   * @param event
   * @param handler
   * @param context
   * @returns {*}
   */
  listenToOnce: function(obj, event, handler, context) {
    let ctx = context || this,
      that = this;

    function wrap(e) {
      let target = e.target || e.srcElement;
      if (target && target === obj) {
        that.off(event, handler);
        return handler.apply(ctx, arguments);
      }
      return false;
    }

    wrap.originalHandler = handler;

    return this.on(event, wrap);
  },

  /**
   * Adds and event listener to a DOM node or a subscription to anything else
   *
   * @param eventNames
   * @param handler
   * @param context
   * @returns {*}
   */
  on: function(eventNames, handler) {
    let delegate = this.el || this;

    return addHandler(delegate, eventNames, handler).reduce((ret, result) => {
      let subscription;
      if (typeof this.subscriptions === "undefined") {
        this.subscriptions = [];
      }

      if (!result.id) {
        subscription = this.subscribe(result.ev, result.fn);
      } else {
        subscription = result;
        this.subscriptions.push(subscription);
      }
      return ret.concat(subscription);
    }, []);
  },

  /**
   * Removes an event listener or subscription
   *
   * @param eventNames
   * @param handler
   * @returns {*}
   */
  off: function(eventNames, handler) {
    let subscription,
      subs = this.subscriptions,
      delegate = this.el || this,
      evts = eventNames.split(" "),
      cb = handler;

    // this is a little slow, but allows us to remove bound event handlers
    // from DOM Nodes!
    let hits = subs.filter(sub => {
      let h = sub.fn.originalHandler || sub.fn;
      return (
        (h === handler || sub.fn.sId === sub.id) && evts.indexOf(sub.ev) !== -1
      );
    });

    if (hits.length) {
      let h = hits.pop();
      cb = h.fn;
    }

    return removeHandler(delegate, eventNames, cb).reduce((ret, result) => {
      if (!result.id) {
        subscription = this.unsubscribe(result.ev, result.fn);
      } else {
        subscription = result;
        subs.splice(subs.indexOf(subscription), 1);
      }
      return ret.concat(subscription);
    }, []);
  },

  /**
   * Adds an event listener whose callback will only be invoked once
   * @param event
   * @param handler
   * @param context
   * @returns {*}
   */
  once: function(event, handler, context) {
    let that = this,
      ctx = context || this;

    function cb(...args) {
      that.off(event, cb);
      return handler.apply(ctx, args);
    }

    cb.sId = guid();
    let subscription = this.on(event, cb);
    return subscription;
  },

  /**
   * Triggers DOM Events
   * @param eventName
   * @param element
   * @param data
   * @returns {*|boolean}
   */
  trigger: function(eventName, data, element) {
    let E,
      el = element || this.el;

    if (isElement(el) && isNative(eventName)) {
      if (CustomEvent in window) {
        E = new CustomEvent(eventName, { detail: data });
      } else {
        E = new Event(eventName, { bubbles: true, cancelable: true });
      }
      return el.dispatchEvent(E);
    }

    if (typeof el[eventName] !== "function") {
      throw new TypeError(`DOMElement.${eventName} is not callable!`);
    }
    return el[eventName]();
  },

  /**
   * Emits custom Events
   * Also passes DOM events through to trigger();
   * @param eventName
   * @param data
   * @param args
   * @returns {*}
   */
  emit: function(eventName, data, ...args) {
    let el = this.el,
      elIsDOM = isElement(el) || isNode(el),
      native = isNative(eventName),
      subscribers = this.mediator.subscribers;

    if (native && elIsDOM) {
      return this.trigger(eventName, { data, args }, el);
    }

    if (subscribers.has(eventName)) {
      let payload = new nEvent(eventName, data, this);
      return this.mediator.dispatch(eventName, payload, args);
    }

    return false;
  },

  /**
   * Adds a pub/sub event handler
   *
   * @param channel
   * @param handler
   * @returns {Array}
   */
  subscribe: function(channel, handler) {
    let subscription = null,
      channels = channel.split(" ");

    return channels.map(ch => {
      try {
        let c = ch.trim();
        subscription = this.mediator.add(c, handler);
        if (typeof this.subscriptions === "undefined") {
          this.subscriptions = [];
        }
        this.subscriptions.push(subscription);
        return subscription;
      } catch (e) {
        console.error("Failed to subscribe to channel " + ch, e);
      }
      return false;
    });
  },

  /**
   * Removes a pub/sub event handler
   * @param channel
   * @param handler
   * @returns {*}
   */
  unsubscribe: function(channel, handler) {
    let ret,
      channels = channel.split(" "),
      subs = this.subscriptions;

    try {
      channels.forEach(ch => {
        let c = ch.trim();
        ret = subs
          .filter(sub => {
            return (
              sub.ev === c &&
              this.mediator.subscribers[c] &&
              this.mediator.subscribers[c][sub.id] === handler
            );
          })
          .map(hit => {
            subs.splice(subs.indexOf(hit), 1);
            return this.mediator.remove(channel, hit.id);
          });
      });
    } catch (e) {
      console.error("Failed to unsubscribe from channel " + channel, e);
    }
    return ret;
  },

  /**
   * Detaches all event listeners
   * @returns {*}
   */
  detachEvents() {
    let subs = this.subscriptions.slice();
    if (subs) {
      return subs.map(({ ev, fn }) => {
        return this.off(ev, fn).pop();
      });
    }
    return false;
  }
});

Evented.prototype.mediator = Dispatcher();

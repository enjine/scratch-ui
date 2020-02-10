/*eslint no-unused-expressions: 0*/

import { settings } from "setup";
import compose from "lib/util/compose";
import { htmlToDom } from "lib/util/DOM";
import { nEvent } from "lib/event/nEvent";

let expect = settings.assertions.expect;
let mocks = settings.mocking;
//let mockRequest = settings.net.mock;
//let net = settings.net.request;

settings.init();

import Evented from "lib/behaviors/Evented";

class testClass extends compose(Evented) {
  foo() {}
}

var testFunc = function() {},
  testeeFunc,
  testeeClass,
  spy,
  spy2; // eslint-disable-line no-unused-vars

testFunc.prototype = new Evented();

function verifyMixin(obj) {
  for (let p in Evented.prototype) {
    if (typeof Evented.prototype[p] === "function") {
      expect(obj).to.respondTo(p);
    } else {
      expect(obj[p]).to.be.ok;
    }
  }
}

describe("Evented.mixin", () => {
  beforeEach(() => {
    testeeFunc = new testFunc();
    testeeClass = new testClass();
    spy = mocks.spy();
    spy2 = mocks.spy();
  });

  it("Can be mixed into a function", () => {
    verifyMixin(testeeFunc);
  });

  it("Can be mixed into a class", () => {
    expect(testeeClass).to.respondTo("foo");
    verifyMixin(testeeClass);
  });

  describe("on()", () => {
    it("Returns an array of subcriptions", () => {
      let cb = mocks.spy(() => {}),
        cb2 = mocks.spy();

      let events = ["click", "splat"],
        subs = testeeFunc.on(events.join(" "), cb),
        classSubs = testeeClass.on(events.join(" "), cb2);

      expect(subs.length).to.equal(events.length);
      expect(classSubs.length).to.equal(events.length);
      expect(testeeFunc.subscriptions.length).to.equal(events.length);
      expect(testeeClass.subscriptions.length).to.equal(events.length);

      subs.forEach((sub, i) => {
        expect(sub.id).to.be.ok;
        expect(sub.ev).to.equal(events[i]);
        expect(sub.fn).to.equal(cb);
      });
      classSubs.forEach((sub, i) => {
        expect(sub.id).to.be.ok;
        expect(sub.ev).to.equal(events[i]);
        expect(sub.fn).to.equal(cb2);
      });
      testeeFunc.off("click", cb);

      testeeClass.off("click", cb2);
      expect(testeeFunc.subscriptions.length).to.equal(1);
      expect(testeeClass.subscriptions.length).to.equal(1);
      testeeFunc.off("splat", cb);
      testeeClass.off("splat", cb2);
      expect(testeeFunc.subscriptions.length).to.equal(0);
      expect(testeeClass.subscriptions.length).to.equal(0);
    });

    it("Event handlers are invoked sonce each time an event fires", () => {
      let cb = mocks.spy(() => {});

      testeeFunc.on("beep boop", cb);
      testeeClass.on("beep boop", cb);

      testeeFunc.emit("beep");
      testeeClass.emit("beep");
      testeeClass.emit("boop");
      cb.should.have.callCount(6);
      testeeFunc.off("beep boop", cb);
      testeeClass.off("beep boop", cb);

      expect(testeeFunc.subscriptions.length).to.equal(0);
      expect(testeeClass.subscriptions.length).to.equal(0);
    });
  });

  describe("detachEvents()", () => {
    it("Removes all attached event listeners", () => {
      let spy = mocks.spy(), // eslint-disable-line no-shadow
        subs = testeeFunc.on("a b c d", spy);
      expect(testeeFunc.subscriptions.length).to.equal(subs.length);
      expect(subs.length).to.equal(4);

      testeeFunc.emit("hello");
      testeeClass.emit("b");
      testeeClass.emit("d");
      spy.should.have.callCount(2);

      let unsubs = testeeFunc.detachEvents();
      expect(unsubs.length).to.equal(4);
      testeeFunc.emit("b");
      testeeClass.emit("d");
      testeeClass.emit("b");
      spy.should.have.callCount(2);
      expect(testeeFunc.subscriptions.length).to.equal(0);
    });
  });

  describe("off()", () => {
    it("Removing event listeners stops them from being called when the respective event fires", () => {
      testeeFunc.on("bing bong", spy2);
      testeeFunc.emit("bing");
      testeeClass.emit("bing");
      testeeClass.emit("bong");
      spy2.should.have.callCount(3);

      testeeFunc.off("bong bing", spy2);
      testeeFunc.emit("bing");
      testeeClass.emit("bing");
      testeeClass.emit("bong");
      spy2.should.have.callCount(3);
      expect(testeeFunc.subscriptions.length).to.equal(0);
    });

    it("Returns an array of all subscriptions that were removed", () => {
      let cb = () => {},
        subs = testeeFunc.on("gorf horf", cb);
      expect(subs).to.be.an.instanceof(Array);
      expect(subs).to.be.ok;
      expect(subs.length).to.equal(2);

      let unsubs = testeeFunc.off("gorf", cb);
      expect(unsubs).to.be.an.instanceof(Array);
      expect(unsubs).to.be.ok;
      expect(unsubs.length).to.equal(1);
      testeeFunc.off("horf", cb);
    });

    it("Removing an event that was not attached returns an empty array", () => {
      let cb = () => {},
        unsubs;
      testeeClass.on("clack flap", cb);
      unsubs = testeeClass.off("yack", cb);

      expect(unsubs).to.be.an.instanceof(Array);
      expect(unsubs).to.be.ok;
      expect(unsubs.length).to.equal(0);
    });

    it("Can remove bound event handlers", () => {
      let cb = mocks.spy(() => {
          console.log("BOUND!!");
        }),
        unsubs;
      testeeClass.on("rip rop", cb.bind(cb));

      testeeClass.emit("rip");
      testeeClass.emit("rop");
      cb.should.have.callCount(2);
      unsubs = testeeClass.off("rip", cb);
      testeeClass.emit("rip");
      testeeClass.emit("rop");
      cb.should.have.callCount(3);
      expect(unsubs).to.be.an.instanceof(Array);
      expect(unsubs).to.be.ok;
      expect(unsubs.length).to.equal(1);
    });
  });

  describe("delegate()", () => {
    it("Delegates an event handler to child elements matching the selector", () => {
      let el = htmlToDom(
          '<div><h1>Hello test <a href="#">decoy</a></h1>  <ul><li><a href="#">one</a></li><li><a href="#">2</a></li><li><a href="#">three</a></li></ul></div>'
        ),
        cb = mocks.spy();

      testeeFunc.el = el;
      testeeFunc.render = () => {
        document.querySelector("body").appendChild(el);
      };

      testeeFunc.render();

      let subs = testeeFunc.delegate("ul", "click", cb),
        unsubs;

      expect(testeeFunc.el).to.be.an.instanceOf(Element);
      expect(subs.length).to.equal(1);
      let decoy = el.querySelector("h1 > a"),
        a = el.querySelector("li > a");

      decoy.click();
      decoy.click();
      a.click();
      a.click();
      unsubs = testeeFunc.off("click", cb); //werx
      //unsubs = testeeFunc.off('click', subs[0].fn); //werx
      //testeeFunc.detachEvents(); //werx
      expect(unsubs.length).to.equal(1);
      a.click();
      a.click();
      cb.should.have.callCount(2);
      document.querySelector("body").removeChild(el);
    });
  });
  describe("delegateOnce()", () => {
    it("Delegates and calls only once", () => {
      let el = htmlToDom(
          '<div><h1>Hello test 2 <a href="#">decoy</a></h1>  <ul><li><a href="#">one</a></li><li><a href="#">2</a></li><li><a href="#">three</a></li></ul></div>'
        ),
        cb = mocks.spy();

      testeeFunc.el = el;
      testeeFunc.render = () => {
        document.querySelector("body").appendChild(el);
      };

      testeeFunc.render();

      let subs = testeeFunc.delegateOnce("ul", "click", cb);

      expect(testeeFunc.el).to.be.an.instanceOf(Element);
      expect(subs.length).to.equal(1);
      let decoy = el.querySelector("h1 > a"),
        a = el.querySelector("li > a");

      decoy.click();
      decoy.click();
      a.click();
      a.click();
      a.click();
      cb.should.have.callCount(1);
      document.querySelector("body").removeChild(el);
    });
  });
  describe("listenTo()", () => {
    it("Enables event delegation on objects rather than DOM elements", () => {
      let cb = mocks.spy(),
        subs;

      subs = testeeFunc.listenTo(testeeClass, "beforeFetch", cb);
      expect(subs.length).to.equal(1);
      testeeClass.emit("beforeFetch");
      testeeClass.emit("beforeFetch");
      testeeFunc.emit("beforeFetch");
      testeeFunc.emit("beforeFetch");
      cb.should.have.callCount(2);
    });
  });
  describe("listenToOnce()", () => {
    it("Delegates to objects and invokes the callback only once", () => {
      let cb = mocks.spy(),
        subs;

      subs = testeeFunc.listenToOnce(testeeClass, "beforeFetch", cb);
      expect(subs.length).to.equal(1);
      testeeClass.emit("beforeFetch");
      testeeClass.emit("beforeFetch");
      testeeFunc.emit("beforeFetch");
      testeeFunc.emit("beforeFetch");
      cb.should.have.callCount(1);
    });
  });
  describe("once()", () => {
    it("Adds an event listener whose callback will only be invoked once", () => {
      let cb = mocks.spy(),
        subs;

      subs = testeeFunc.once("beforeFetch", cb);
      expect(subs.length).to.equal(1);
      testeeClass.emit("beforeFetch");
      testeeClass.emit("beforeFetch");
      testeeFunc.emit("beforeFetch");
      testeeFunc.emit("beforeFetch");
      cb.should.have.callCount(1);
    });
  });
  describe("trigger()", () => {
    let el = htmlToDom(
      '<div><h1>Hello test 2 <a href="#">decoy</a></h1>  <ul><li><a href="#">one</a></li><li><a href="#">2</a></li><li><a href="#">three</a></li></ul></div>'
    );
    it("Will throw a reference error if callback is event handler is not a function", () => {
      let k = mocks.spy(testFunc);
      expect(testeeFunc.trigger.bind(k, "click")).to.throw(TypeError);
    });

    it("Triggers DOM Events", () => {
      let cb = mocks.spy(),
        doc; // eslint-disable-line no-unused-vars

      testeeFunc.el = el;
      testeeClass.el = htmlToDom('<a href="#"><h1>eep</h1></a>');
      testeeFunc.render = () => {
        doc = document.querySelector("body").appendChild(el);
      };
      testeeClass.render = () => {
        document.querySelector("body").appendChild(testeeClass.el);
      };

      testeeFunc.render();
      testeeClass.render();

      let subs = testeeFunc.on("click", cb);

      expect(testeeFunc.el).to.be.an.instanceOf(Element);
      expect(subs.length).to.equal(1);
      let decoy = el.querySelector("h1 > a"),
        a = el.querySelector("li > a");

      testeeFunc.trigger("click", { v: "func" });
      testeeClass.trigger("click", { v: "class" }); // this one should not get handled
      decoy.click({ v: "decoy" });
      a.click({ v: "el" });
      cb.should.have.callCount(3);
      document.querySelector("body").removeChild(el);
      document.querySelector("body").removeChild(testeeClass.el);
    });
  });
  describe("emit()", () => {
    it("Emits custom Events or passes native DOM events through to trigger()", () => {
      let cb = mocks.spy(),
        ncb = mocks.spy(),
        tcb = mocks.spy(testeeFunc, "trigger");

      testeeFunc.el = htmlToDom('<a href="#"><h1>eep</h1></a>');

      testeeFunc.on("emitted", cb);
      testeeFunc.on("click", ncb);

      testeeClass.emit("emitted");
      testeeFunc.emit("emitted");
      testeeClass.emit("click");
      testeeFunc.emit("click");

      cb.should.have.callCount(2);
      ncb.should.have.callCount(1);
      tcb.should.have.callCount(1);
      tcb.should.have.been.calledWith("click");
    });
    it("Custom events can have payloads", () => {
      let cb = mocks.spy(payload => {
        if (typeof payload === "function") {
          expect(payload()).to.deep.equal({ i: 2 });
        } else {
          expect(payload).to.deep.equal({ i: 1 });
        }
      });

      testeeFunc.el = htmlToDom('<a href="#"><h1>eep</h1></a>');

      testeeFunc.on("custom", cb);

      testeeClass.emit("custom", { i: 1 });
      testeeFunc.emit("custom", function() {
        return { i: 2 };
      });
      testeeClass.emit("click");
      testeeFunc.emit("click");

      cb.should.have.callCount(2);
    });

    it("Values will be provided as arguments to the callback, in the same order they were passed", async () => {
      let s = mocks.spy(),
        cb = mocks.spy((...args) => {
          expect(args[0]).to.be.an.instanceOf(nEvent);
          expect(args[0].data).to.eql({ test: true, s });
          expect(args[1]).to.eql({ second: true });
          expect(args[2]).to.eql({ third: true });
        });

      testeeFunc.on("test", cb);
      await testeeClass.emit(
        "test",
        { test: true, s },
        { second: true },
        { third: true }
      );

      expect(cb).to.have.been.calledOnce;
      // dunno why this is not working... grrr.
      //cb.should.have.been.calledWithMatch({second: true}, {third: true});
    });
  });
  describe("subscribe()", () => {
    it("Adds a pub/sub event handler", () => {
      let cb = mocks.spy(),
        subs = testeeFunc.subscribe("channelOne", cb);

      expect(subs.length).to.equal(1);
      expect(subs[0].id).to.be.ok;
      expect(subs[0].fn).to.deep.equal(cb);

      testeeClass.emit("channelOne");
      testeeClass.emit("channelOne");
      testeeClass.emit("not-message");

      cb.should.have.callCount(2);
    });
  });
  describe("unsubscribe()", () => {
    it("Removes a pub/sub event handler", () => {
      let cb = mocks.spy(),
        subs = testeeFunc.subscribe("channelOne", cb);

      expect(subs.length).to.equal(1);
      expect(subs[0].id).to.be.ok;
      expect(subs[0].fn).to.deep.equal(cb);

      testeeClass.emit("channelOne");
      testeeClass.emit("channelOne");
      testeeClass.emit("not-message");

      cb.should.have.callCount(2);

      testeeFunc.unsubscribe("channelOne", cb);

      expect(subs.length).to.equal(1);
      expect(subs[0].id).to.be.falsy;
      expect(subs[0].fn).to.deep.equal(cb);

      testeeClass.emit("channelOne");
      testeeClass.emit("channelOne");
      testeeClass.emit("not-message");

      cb.should.have.callCount(2);
    });
  });
});

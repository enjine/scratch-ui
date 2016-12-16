/*eslint no-unused-expressions: 0*/

import {settings} from 'setup';
import compose from 'lib/util/compose';
import {EmitterMixinBehavior} from 'behaviors/emitter';

let expect = settings.assertions.expect;
let mocks = settings.mocking;
//let mockRequest = settings.net.mock;
//let net = settings.net.request;

settings.init();

import Evented from 'lib/behaviors/Evented';

class testClass extends compose(Evented) {
    foo () {
    }
}

let testFunc = function () {
    },
    testeeFunc,
    testeeClass,
    spy, spy2;

testFunc.prototype = new Evented();

function verifyMixin (obj) {
    for (let p in Evented.prototype) {
        if (typeof Evented.prototype[p] === 'function') {
            expect(obj).to.respondTo(p);
        } else {
            expect(obj[p]).to.be.ok;
        }
    }
}

describe('Evented.mixin', () => {
    before(() => {
        testeeFunc = new testFunc();
        testeeClass = new testClass();
        spy = mocks.spy();
        spy2 = mocks.spy();

    });

    it('Can be mixed into a function', () => {
        verifyMixin(testeeFunc);
    });

    it('Can be mixed into a class', () => {
        expect(testeeClass).to.respondTo('foo');
        verifyMixin(testeeClass);
    });

    describe('on()', () => {
        it('Returns an array of subcriptions', () => {
            let cb = mocks.spy(() => {
            }), cb2 = mocks.spy();

            let events = ['click', 'splat'],
                subs = testeeFunc.on(events.join(' '), cb),
                classSubs = testeeClass.on(events.join(' '), cb2);

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
            testeeFunc.off('click', cb);

            testeeClass.off('click', cb2);
            expect(testeeFunc.subscriptions.length).to.equal(1);
            expect(testeeClass.subscriptions.length).to.equal(1);
            testeeFunc.off('splat', cb);
            testeeClass.off('splat', cb2);
            expect(testeeFunc.subscriptions.length).to.equal(0);
            expect(testeeClass.subscriptions.length).to.equal(0);

        });

        it('Event handlers are invoked once each time an event fires', () => {
            let cb = mocks.spy(() => {
            });

            testeeFunc.on('beep boop', cb);
            testeeClass.on('beep boop', cb);

            testeeFunc.emit('beep');
            testeeClass.emit('beep');
            testeeClass.emit('boop');
            cb.should.have.callCount(6);
            testeeFunc.off('beep boop', cb);
            testeeClass.off('beep boop', cb);

            expect(testeeFunc.subscriptions.length).to.equal(0);
            expect(testeeClass.subscriptions.length).to.equal(0);

        });


    });

    describe('detachEvents()', () => {
        it('Removes all attached event listeners', () => {
            let spy = mocks.spy(),
                subs = testeeFunc.on('a b c d', spy);
            expect(testeeFunc.subscriptions.length).to.equal(subs.length);
            expect(subs.length).to.equal(4);

            testeeFunc.emit('hello');
            testeeClass.emit('b');
            testeeClass.emit('d');
            spy.should.have.callCount(2);

            let unsubs = testeeFunc.detachEvents();
            expect(unsubs.length).to.equal(4);
            testeeFunc.emit('b');
            testeeClass.emit('d');
            testeeClass.emit('b');
            spy.should.have.callCount(2);
            expect(testeeFunc.subscriptions.length).to.equal(0);

        });
    });

    describe('off()', () => {
        it('Removing event listeners stops them from being called when the respective event fires', () => {
            let subs = testeeFunc.on('bing bong', spy2);
            testeeFunc.emit('bing');
            testeeClass.emit('bing');
            testeeClass.emit('bong');
            spy2.should.have.callCount(3);

            let unsubs = testeeFunc.off('bing bong', spy2);
            testeeFunc.emit('bing');
            testeeClass.emit('bing');
            testeeClass.emit('bong');
            spy2.should.have.callCount(3);
            expect(testeeFunc.subscriptions.length).to.equal(0);

        });

        it('Returns an array of all subscriptions that were removed', () => {
            let cb = () => {
                },
                subs = testeeFunc.on('gorf horf', cb);
            expect(subs).to.be.an.instanceof(Array);
            expect(subs).to.be.ok;
            expect(subs.length).to.equal(2);

            let unsubs = testeeFunc.off('gorf', cb);
            expect(unsubs).to.be.an.instanceof(Array);
            expect(unsubs).to.be.ok;
            expect(unsubs.length).to.equal(1);
            testeeFunc.off('horf', cb);
        });

        it('Removing an event that was not attached returns an empty array', () => {
            let cb = () => {
                },
                subs = testeeClass.on('clack flap', cb),
                unsubs = testeeClass.off('yack', cb);

            expect(unsubs).to.be.an.instanceof(Array);
            expect(unsubs).to.be.ok;
            expect(unsubs.length).to.equal(0);
        });
    });

    describe('delegate()', () => {
        xit('stub', () => {
        });
    });
    describe('delegateOnce()', () => {
        xit('stub', () => {
        });
    });
    describe('listenTo()', () => {
        xit('stub', () => {
        });
    });
    describe('listenToOnce()', () => {
        xit('stub', () => {
        });
    });
    describe('once()', () => {
        xit('stub', () => {
        });
    });
    describe('trigger()', () => {
        xit('stub', () => {
        });
    });
    describe('emit()', () => {
        xit('stub', () => {
        });
    });
    describe('subscribe()', () => {
        xit('stub', () => {
        });
    });
    describe('unsubscribe()', () => {
        xit('stub', () => {
        });
    });

});

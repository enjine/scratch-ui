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

Object.assign(testFunc.prototype, Evented.prototype);

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
            });

            let events = ['click', 'splat'],
                subs = testeeFunc.on(events.join(' '), cb),
                classSubs = testeeClass.on(events.join(' '), cb);

            expect(subs.length).to.equal(2);
            expect(classSubs.length).to.equal(2);

            subs.forEach((sub, i) => {
                expect(sub.id).to.be.ok;
                expect(sub.ev).to.equal(events[i]);
                expect(sub.fn).to.equal(cb);
            });
            classSubs.forEach((sub, i) => {
                expect(sub.id).to.be.ok;
                expect(sub.ev).to.equal(events[i]);
                expect(sub.fn).to.equal(cb);
            });
            testeeFunc.off('click', cb);
            testeeClass.off('click', cb);
        });

        it('Event handlers are invoked once each time an event fires', () => {
            let cb = mocks.spy(() => {
            });

            testeeFunc.on('click resize', cb);
            testeeClass.on('click resize', cb);

            testeeFunc.emit('click');
            testeeClass.emit('click');
            testeeClass.emit('resize');
            cb.should.have.callCount(6);
            testeeFunc.off('click resize', cb);
            testeeClass.off('click resize', cb);

        });


    });

    describe('off()', () => {
        it('Removing event listeners stops them from being called when the respective event fires', () => {
            let subs = testeeFunc.on('click resize', spy2);
            testeeFunc.emit('click');
            testeeClass.emit('click');
            testeeClass.emit('resize');
            spy2.should.have.callCount(3);

            let unsubs = testeeFunc.off('click resize', spy2);
            testeeFunc.emit('click');
            testeeClass.emit('click');
            testeeClass.emit('resize');
            spy2.should.have.callCount(3);

        });

        it('Returns an array of all subscriptions that were removed', () => {
            let cb = () => {
                },
                subs = testeeFunc.on('click resize', cb);
            expect(subs).to.be.an.instanceof(Array);
            expect(subs).to.be.ok;
            expect(subs.length).to.equal(2);

            let unsubs = testeeFunc.off('click', cb);
            expect(unsubs).to.be.an.instanceof(Array);
            expect(unsubs).to.be.ok;
            expect(unsubs.length).to.equal(1);
            testeeFunc.off('resize', cb);
        });

        it('Removing an event that was not attached returns an empty array', () => {
            let cb = () => {
                },
                subs = testeeClass.on('click resize', cb),
                unsubs = testeeClass.off('yack', cb);

            expect(unsubs).to.be.an.instanceof(Array);
            expect(unsubs).to.be.ok;
            expect(unsubs.length).to.equal(0);
        });
    });

    describe('delegate()', () => {
        xit('stub', () => {});
    });
    describe('delegateOnce()', () => {
        xit('stub', () => {});
    });
    describe('listenTo()', () => {
        xit('stub', () => {});
    });
    describe('listenToOnce()', () => {
        xit('stub', () => {});
    });
    describe('once()', () => {
        xit('stub', () => {});
    });
    describe('trigger()', () => {
        xit('stub', () => {});
    });
    describe('emit()', () => {
        xit('stub', () => {});
    });
    describe('subscribe()', () => {
        xit('stub', () => {});
    });
    describe('unsubscribe()', () => {
        xit('stub', () => {});
    });

});

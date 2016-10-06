/*eslint no-unused-expressions: 0*/
import {settings} from '../../setup';

let expect = settings.assertions.expect;
let mocks = settings.mocking;

export var DomEventBehavior = {
    describe: function () {
        return 'Implements the DomEvent behavior.';
    },
    test: function (o) {


        describe('Adding Listeners', () => {
            it('Handles events according to the listener type', () => {
                let handler = mocks.spy(),
                    onceHandler = mocks.spy();

                o.on('keyup', handler);
                o.once('resize', onceHandler);
                o.emit('keyup');
                o.emit('keyup');
                o.emit('resize');
                o.emit('resize');
                o.emit('resize');
                o.off('click', handler);

                handler.should.have.been.calledTwice;
                onceHandler.should.have.been.calledOnce;
            });

            it('When attaching a native (DOM) event listener, returns a subscription with 3 properties, `id`, `evt`, `fn`', () => {
                let subscriptions = o.on('click', () => {
                });

                expect(subscriptions).to.an.instanceOf(Array);
                expect(subscriptions[0].id).to.be.ok;
                expect(subscriptions[0].fn).to.be.a('function');
                expect(subscriptions[0].ev).to.equal('click');
            });

            it('DomEvent subscriptions have special properties...', () => {
                let subscriptions = o.on('beep', () => {
                });
                expect(subscriptions).to.an.instanceOf(Array);
                expect(subscriptions[0].id).to.be.ok;
                expect(subscriptions[0].ev).to.be.ok;
                expect(subscriptions[0].id.length).to.be.greaterThan(0);
                expect(subscriptions[0].ev.length).to.be.greaterThan(0);
                expect(subscriptions[0].fn).to.be.a('function');
                expect(subscriptions[0].fn.sId).to.be.ok;
                expect(subscriptions[0].fn.sId.length).to.be.greaterThan(0);
                expect(subscriptions[0].ev).to.equal('beep');
            });
        });

        describe('Removing Listeners', () => {
            it('When removing an event listener, returns subscription without the sId property.', () => {
                let cb = mocks.spy(),
                    subscriptions = o.on('keyup change', cb),
                    unsubscribed = o.off('keyup', cb);

                expect(subscriptions).to.an.instanceOf(Array);
                expect(subscriptions.length).to.equal(2);
                expect(unsubscribed).to.an.instanceOf(Array);
                expect(unsubscribed.length).to.equal(1);
                expect(unsubscribed[0].id).to.be.falsy;
                expect(unsubscribed[0].ev).to.equal('keyup');
                expect(unsubscribed[0].fn).to.be.a('function');
                expect(unsubscribed[0].fn.sId).to.be.undefined;
            });
        });
    }
};

/*eslint no-unused-expressions: 0*/
import {settings} from '../../setup';

let expect = settings.assertions.expect;
let mocks = settings.mocking;

export var PubSubBehavior = {
    describe: function () {
        return 'Implements the PubSub behavior.';
    },
    test: function (o) {


        describe('Adding Listeners', () => {
            let viewARubADub = mocks.spy();

            it('`once` subscriptions are called exactly once.', () => {
                let s = o.once('rubadub', viewARubADub);
                o.emit('rubadub');
                o.emit('rubadub');
                o.emit('rubadub');
                let u = o.off('rubadub', viewARubADub);

                viewARubADub.should.have.been.calledOnce;
            });

            it('When attaching a PubSub event, returns a subscription with 3 properties, `id`, `evt`, `fn`', () => {
                let subscriptions = o.on('someChannelEvent', () => {
                });
                expect(subscriptions).to.an.instanceOf(Array);
                expect(subscriptions[0].id).to.be.ok;
                expect(subscriptions[0].fn).to.be.a('function');
                expect(subscriptions[0].ev).to.equal('someChannelEvent');
            });
        });

        describe('Removing Listeners', () => {
            it('Un-subscriptions have special properties...', () => {
                let cb = mocks.spy(),
                    subscriptions = o.on('beep boop', cb),
                    unsubscribed = o.off('beep', cb);

                expect(subscriptions).to.an.instanceOf(Array);
                expect(subscriptions.length).to.equal(2);
                expect(unsubscribed).to.an.instanceOf(Array);
                expect(unsubscribed.length).to.equal(1);
                expect(unsubscribed[0].id).to.be.falsy;
                expect(unsubscribed[0].ev).to.equal('beep');
                expect(unsubscribed[0].fn).to.be.a('function');
                expect(unsubscribed[0].fn.sId).to.be.undefined;
            });
        });
    }
};

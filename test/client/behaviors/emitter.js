/*eslint no-unused-expressions: 0*/
import {EventBoss} from '../../../lib/client/modules/events';
import {settings} from '../../setup';

let expect = settings.assertions.expect;
let mocks = settings.mocking;

export var EmitterMixinBehavior = {
	describe: function () {
		return 'Implements the Emitter mixin.';
	},
	test: function (o) {
		let mediator,
			handler = mocks.spy(),
			onceHandler = mocks.spy();

		before(() => {
			mediator = o.mediator;
		});

		after(() => {
			mediator = null;
		});

		it('Defines a `mediator` property that is an instance of EventBoss.', () => {
			expect(mediator).to.exist;
			expect(mediator).to.be.an.instanceof(EventBoss);
		});

		it('Implements emit().', () => {
			expect(o).to.respondTo('emit');
		});

		it('Implements on().', () => {
			expect(o).to.respondTo('on');
		});

		it('Implements once().', () => {
			expect(o).to.respondTo('once');
		});

		it('Implements off().', () => {
			expect(o).to.respondTo('off');
		});

		it('Implements publish().', () => {
			expect(o).to.respondTo('publish');
		});

		it('Implements subscribe().', () => {
			expect(o).to.respondTo('subscribe');
		});

		/*describe('Event Handling', function () {
			beforeEach(() => {
				o.trigger('click');
				o.emit('click');
				o.trigger('onceTest');
				o.emit('onceTest');
				o.trigger('onceTest');
			});

			afterEach(() => {
				o.off('click', handler);
			});

			it('Handles events according to the listener type', () => {
				handler.should.have.been.calledTwice;
				onceHandler.should.have.been.calledOnce;
				expect(o.mediator.events.onceTest).to.have.length(0);
			});
		});*/
	}
};

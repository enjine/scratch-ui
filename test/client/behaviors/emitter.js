/*eslint no-unused-expressions: 0*/
import {settings} from '../../setup';

let expect = settings.assertions.expect;
//let mocks = settings.mocking;

export var EmitterMixinBehavior = {
	describe: function () {
		return 'Mixes the Evented behavior.';
	},
	test: function (o) {
		/*let handler = mocks.spy(),
			onceHandler = mocks.spy();

		o.on('keyup', handler);
		o.once('resize', onceHandler);*/

		it('Implements emit().', () => {
			expect(o).to.respondTo('emit');
		});


		it('Implements on().', () => {
			expect(o).to.respondTo('on');
		});

		it('Implements trigger().', () => {
			expect(o).to.respondTo('trigger');
		});

		it('Implements once().', () => {
			expect(o).to.respondTo('once');
		});

		it('Implements off().', () => {
			expect(o).to.respondTo('off');
		});

		it('Implements subscribe().', () => {
			expect(o).to.respondTo('subscribe');
		});

		it('Implements unsubscribe().', () => {
			expect(o).to.respondTo('unsubscribe');
		});


		/*describe('Event Handling', function () {
			beforeEach(() => {
				o.emit('keyup');
				o.emit('keyup');
				o.emit('resize');
				o.emit('resize');
				o.emit('resize');
			});

			afterEach(() => {
				o.off('click', handler);
			});

			it('Handles event according to the listener type', () => {
				handler.should.have.been.calledTwice;
				onceHandler.should.have.been.calledOnce;
			});
		});*/
	}
};

/*eslint no-unused-expressions: 0*/
import {EventBoss} from '../../../lib/client/modules/events';
import {settings} from '../../setup';

let expect = settings.assertions.expect;

export var EmitterMixinBehavior = {
	describe: function () {
		return 'Implements the Emitter mixin.';
	},
	test: function (o) {
		let mediator;

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
	}
};

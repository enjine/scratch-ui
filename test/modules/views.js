import View from '../../src/client/com.e750/lib/classes/views/View';

import {settings} from '../setup';
import {EmitterMixinBehavior} from '../behaviors/emitter';
import {PubSubBehavior} from '../behaviors/pubsub';

let expect = settings.assertions.expect;
let mocks = settings.mocking;

settings.init();

let viewRender, viewRenderOnce, quackSpy;

class testView extends View {}
describe('Views', () => {
	let viewA, viewB;

	before(() => {
		viewRender = mocks.spy();
		viewRenderOnce = mocks.spy();
		quackSpy = mocks.spy();

		viewA = new testView({
			quack: quackSpy,
			prerender: function () {
				this.emit('beforeRender');
				this.options.quack();
				return this.render();
			}
		});
		viewB = new testView({
			quack: function () {
				return 'moooo';
			},
			prerender: function () {
				this.emit('beforeRender');
				this.options.quack();
				return this.render();
			}
		});

		viewA.on('beforeRender', viewRender);
		viewB.once('beforeRender', viewRenderOnce);
	});

	after(() => {
		viewA.destroy();
		viewB.destroy();
	});

	it('Handles constructor arguments appropriately', () => {
		expect(viewA.options.quack).to.be.a('function');
		expect(viewA.options.prerender).to.be.a('function');
	});

	it('Implements render()', () => {
		expect(viewA).to.respondTo('render');
	});

	it('Implements destroy()', () => {
		expect(viewA).to.respondTo('destroy');
	});

	it('Implements detachEvents()', () => {
		expect(viewA).to.respondTo('detachEvents');
	});

	it('Handles events', () => {
		viewA.options.prerender.call(viewA);
		viewA.options.prerender.call(viewA);
		viewB.options.prerender.call(viewB);
		viewB.options.prerender.call(viewB);
		viewRender.should.have.callCount(4);
		viewRenderOnce.should.have.callCount(1);
		quackSpy.should.have.callCount(2);
	});

	describe(EmitterMixinBehavior.describe(), EmitterMixinBehavior.test.bind(this, new testView()));
	describe(PubSubBehavior.describe(), PubSubBehavior.test.bind(this, new testView()));

});



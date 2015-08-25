/*eslint no-unused-expressions: 0*/
import {BaseView} from '../../../lib/client/modules/views';

import {settings} from '../../setup';
import {EmitterMixinBehavior} from '../behaviors/emitter';
import {inherits} from '../../../lib/client/modules/util';

let expect = settings.assertions.expect;
let mocks = settings.mocking;

settings.init();

describe('Views::Generic', () => {
	let handler = mocks.spy(),
		onceHandler = mocks.spy(),
		pubsubOnce = mocks.spy(),
		testView = function () {
			BaseView.apply(this, arguments);

			this.on('click', handler);
			this.once('onceTest', onceHandler);
			//this.subscribeOnce('pubsub', pubsubOnce);
		};

	inherits(testView, BaseView);

	let v;

	beforeEach(()=> {
		v = new testView(document.createElement('figure'), {swerve: true});
	});

	afterEach(() => {
		v = null;
	});

	it('Is a descendant of BaseView', () => {
		expect(v).to.be.an.instanceof(BaseView);
		expect(v).to.be.an.instanceof(testView);
	});

	it('Handles constructor element arguments that are elements.', () => {
		expect(v.el.tagName).to.exist;
		expect(v.el.tagName).to.equal('FIGURE');
	});

	it('Handles constructor element arguments that are strings.', () => {
		let v2 = new testView('figure');

		expect(v2.el.tagName).to.exist;
		expect(v2.el.tagName).to.equal('FIGURE');
	});

	it('Handles constructor options arguments appropriately', () => {
		expect(v.options.swerve).to.exist;
	});

	describe(EmitterMixinBehavior.describe(), EmitterMixinBehavior.test.bind(this, new testView()));

	describe('Single Events', () => {
		let v2,
			handler2 = mocks.spy();

		beforeEach(() => {
			v2 = new testView('em');
			v2.on('dblclick', handler2);

			v.trigger('click');
			v.emit('click');
			v.trigger('onceTest');
			v.emit('onceTest');
			v.trigger('onceTest');
			v2.trigger('dblclick');
			v2.trigger('dblclick');
			v2.trigger('dblclick');
		});

		afterEach(() => {
			v.off('click', handler);
		});

		it('Handles events according to the listener type', () => {
			handler.should.have.been.calledTwice;
			handler2.should.have.been.calledThrice;
			onceHandler.should.have.been.calledOnce;
			//expect(v.mediator.once.onceTest).to.have.length(0);
			//expect(v.mediator.events[v].onceTest).to.have.length(0);
		});
	});

	describe('Broadcast Events', () => {
		let v2,
			handler3 = mocks.spy();

		beforeEach(() => {
			v2 = new testView('div');
			v.subscribe('pubsub', handler3);
			v.once('pubsub', pubsubOnce);
			v2.subscribeOnce('pubsub', pubsubOnce);
			v.publish('pubsub', {test: 'data'});
			v2.publish('pubsub', {test2: 'data2'});
			v2.emit('pubsub', {test3: 'data3'});
		});

		afterEach(() => {
			v.unsubscribe('pubsub', handler3);
		});

		it('Handles events according to the listener type', () => {
			handler3.should.have.been.calledThrice;
			//pubsubOnce.should.have.been.calledOnce;
		});
	});




});

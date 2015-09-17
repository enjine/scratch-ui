/*eslint no-unused-expressions: 0*/
import {View} from '../../../lib/client/com.e750/views';

import {settings} from '../../setup';
//import {EmitterMixinBehavior} from '../behaviors/emitter';

let expect = settings.assertions.expect;
let mocks = settings.mocking;

settings.init();

let instanceTestViewAClick,
	instanceTestViewAOnceBroadcast,
	instanceTestViewAOnceMouseup,
	instanceTestViewBOnceMouseenter,
	instanceTestViewBOnDblclick,
	viewCPubSub,
	viewCHubBub,
	viewCRubADub,
	testView,
	instances = [];


describe('Views', () => {

	let viewA, viewB;

	before(() => {
		instanceTestViewAClick = mocks.spy();
		instanceTestViewAOnceBroadcast = mocks.spy();
		instanceTestViewAOnceMouseup = mocks.spy();
		instanceTestViewBOnceMouseenter = mocks.spy();
		instanceTestViewBOnDblclick = mocks.spy();
		viewCPubSub = mocks.spy();
		viewCHubBub = mocks.spy();
		viewCRubADub = mocks.spy();

		testView = function () {
			View.apply(this, arguments);
			this.on('click', instanceTestViewAClick);
			this.once('onceTest', instanceTestViewAOnceBroadcast);
			this.once('mouseup', instanceTestViewAOnceMouseup);
		};

		testView.prototype = Object.create(View.prototype);
	});

	beforeEach(()=> {
		instanceTestViewAClick = mocks.spy();
		instanceTestViewAOnceBroadcast = mocks.spy();
		instanceTestViewAOnceMouseup = mocks.spy();
		instanceTestViewBOnceMouseenter = mocks.spy();
		instanceTestViewBOnDblclick = mocks.spy();
		viewCPubSub = mocks.spy();
		viewCHubBub = mocks.spy();
		viewCRubADub = mocks.spy();
		instances = [];
		viewA = new testView(document.createElement('figure'), {swerve: true});
		viewB = new testView('figure');
		instances.push([viewA, viewB]);
	});

	afterEach(() => {
		let teardownA = viewA.destroy();
		let teardownB = viewB.destroy();
		console.log('teardowns:', teardownA, teardownB);

	});

	after(() => {
		console.log('instances', instances);
		viewA = viewB = null;
	});


	it('Handles constructor element arguments that are elements.', () => {
		expect(viewA.el.tagName).to.exist;
		expect(viewA.el.tagName).to.equal('FIGURE');
	});

	it('Handles constructor element arguments that are strings.', () => {

		expect(viewA.el.tagName).to.exist;
		expect(viewA.el.tagName).to.equal('FIGURE');
	});

	it('Handles constructor options arguments appropriately', () => {
		expect(viewA.options.swerve).to.exist;
		expect(viewA.options.swerve).to.equal(true);
	});

	describe('Events', () => {
		describe('API', () => {
			before(() => {
				viewA = new testView('ul');
			});

			beforeEach(() => {

			});

			it('Implements emit().', () => {
				expect(viewA).to.respondTo('emit');
			});

			it('Implements on().', () => {
				expect(viewA).to.respondTo('on');
			});

			it('Implements once().', () => {
				expect(viewA).to.respondTo('once');
			});

			it('Implements off().', () => {
				expect(viewA).to.respondTo('off');
			});

			it('Implements subscribe().', () => {
				expect(viewA).to.respondTo('subscribe');
			});

			it('Implements unsubscribe().', () => {
				expect(viewA).to.respondTo('unsubscribe');
			});
		});

		xdescribe('Adding Listeners', () => {
			it('When attaching a native (DOM) event listener, returns a subscription.', () => {

			});

			it('When attaching a PubSub event, returns a subscription.', () => {

			});

			it('Subscriptions have 3 properties, `id`, `evt`, `fn`', () => {

			});

			it('ID and EVT must be non-null strings with length > 0', () => {

			});

			it('FN must be a function', () => {


			});

			it('FN must have an `sId` property set to a non-null string with length > 0', () => {

			});

		});

		xdescribe('Removing Listeners', () => {
			it('When removing a native (DOM) event listener, returns the subscription without the sId property.', () => {

			});

			it('When removing a PubSub event, returns the subscription without the sId property.', () => {

			});

			it('Subscriptions have 3 properties, `id`, `evt`, `fn`', () => {

			});

			it('ID and EVT must be non-null strings with length > 0', () => {

			});

			it('FN must be a function', () => {

			});

			it('FN.sId must be undefined', () => {

			});
		});

		xdescribe('Sending Payloads', () => {
			it('When an event is dispatched, any number of values can be passed along.', () => {

			});

			it('Values will be provided as arguments to the callback, in the same order they were passed', () => {

			});
		});


		describe('DOM Events', () => {
			beforeEach(() => {
				viewB = new testView('em');
				instances.push(viewB);

				viewB.on('dblclick', instanceTestViewBOnDblclick);
				viewB.once('mouseenter', instanceTestViewBOnceMouseenter);

				viewA.emit('click');
				viewA.emit('mouseup');
				viewB.emit('mouseup');
				viewB.emit('mouseup');
				viewB.emit('click');
				viewA.emit('mouseenter');
				viewA.emit('mouseenter');
				viewB.emit('mouseenter');
				viewB.emit('dblclick');
				viewA.emit('dblclick'); //view A should not trigger viewB's listener
				viewB.emit('dblclick');
			});

			afterEach(() => {
				viewA.off('click', instanceTestViewAClick);
				viewB.emit('click');

				viewB.destroy();
			});

			after(() => {
				console.log('instances', instances);
				viewB = null;
			});

			it('Handles event according to the listener type', () => {
				instanceTestViewAClick.should.have.been.calledTwice;
				instanceTestViewBOnDblclick.should.have.been.calledTwice;
				instanceTestViewAOnceMouseup.should.have.been.calledTwice;
				instanceTestViewBOnceMouseenter.should.have.been.calledOnce;
			});
		});

		describe('PubSub Events', () => {
			let viewC;

			before(() => {

			});

			beforeEach(() => {
				instances = [];
				viewC = new testView('div');
				instances.push(viewC);
				viewC.on('pubsub', viewCPubSub);
				viewC.once('hubub', viewCHubBub);
				viewA.once('rubadub', viewCRubADub);
			});

			afterEach(() => {
				viewA.off('pubsub', viewCPubSub);
				viewC.destroy();
			});

			after(() => {
				console.log('instances', instances);
				viewC = null;
			});

			it('Each instance of `testView` with a `once` listener (3 total) handles messages published to the `onceTest` channel exactly once.', () => {
				viewA.emit('onceTest');
				viewA.emit('onceTest');
				viewB.emit('onceTest');
				viewB.emit('onceTest');
				viewC.emit('onceTest');
				viewC.emit('onceTest');
				viewA.emit('onceTest');
				//there are 3 instances of `testView` with a once listener 3 x 1 = 3;
				//TODO: Write these tests a little differently so the expected outputs are less ambigous.
				instanceTestViewAOnceBroadcast.should.have.been.calledThrice;
			});

			it('ViewC handles messages published to `pubsub` exactly 3 times', () => {
				viewA.emit('pubsub');
				viewB.emit('pubsub');
				viewC.emit('pubsub');
				viewCPubSub.should.have.been.calledThrice;
			});

			it('ViewC handles messages published to `hubub` only once', () => {
				viewC.emit('hubub');
				viewB.emit('hubub');
				viewA.emit('hubub');
				viewCHubBub.should.have.been.calledOnce;
			});

			it('ViewC handles messages published to `rubadub` only once', () => {
				viewA.emit('rubadub');
				viewB.emit('rubadub');
				viewC.emit('rubadub');
				viewCRubADub.should.have.been.calledOnce;
			});
		});
	});

	xdescribe('View Management', () => {
		it('Tearsdown views, recursively.', () => {
			//create a view, attach listeners, send some events.
			//add some child views, add some listeners there too for good measure
			//let viewD = new testView();
			//confirm that that works as expected and callbacks execute the expected number of times
			//viewD.destroy();
			//fire the events again
			//confirm there is no change in the data or number of times callbacks executed.
		});
	});

});

import {BaseCollection, ProductCollection} from '../../../lib/client/modules/collections';
import {Product} from '../../../lib/client/modules/models';
import {EventBoss, Emitter} from '../../../lib/client/modules/events';
import {settings} from '../../setup';

let expect = settings.assertions;
let mocks = settings.mocking;

settings.init();


describe('ProductCollection', () => {
	let pc = new ProductCollection(),
		reqOpts = {
			url: '/api/products/',
			type: 'json',
			method: 'GET',
			headers: {
				'X-Auth-Token': 'xxxxxxxxx'
			}
		},
		thenable = null;

	before(() => {

	});

	after(() => {

	});

	it('Has a constructor name of `ProductCollection`.', () => {
		expect(pc).to.be.an.instanceof(ProductCollection);
	});

	it('Has a `model` property set to `Product`.', () => {
		expect(pc.model).to.deep.equal(Product);
	});

	it('Has a prototype that is a copy of BaseCollection.prototype.', () => {
		let pcProto = Object.getPrototypeOf(pc);
		expect(pcProto).to.deep.equal(BaseCollection.prototype);
	});

	describe('Implements the Emitter interface.', () => {
		let mediator;

		before(() => {
			mediator = pc.mediator;
		});

		after(() => {
			mediator = null;
		});

		it('Defines a `mediator` property that is an instance of EventBoss.', () => {
			expect(mediator).to.not.be.undefined;
			expect(mediator).to.be.an.instanceof(EventBoss);
		});

		it('Implements emit().', () => {
			expect(pc).to.respondTo('emit');
		});

		it('Implements on().', () => {
			expect(pc).to.respondTo('on');
		});

		it('Implements once().', () => {
			expect(pc).to.respondTo('once');
		});

		it('Implements off().', () => {
			expect(pc).to.respondTo('off');
		});

		it('Implements publish().', () => {
			expect(pc).to.respondTo('publish');
		});

		it('Implements subscribe().', () => {
			expect(pc).to.respondTo('subscribe');
		});

	});

	describe('Can make network requests via a fetch() method.', () => {
		it('Implements fetch()', () => {
			expect(pc).to.respondTo('fetch');
		});

		describe('Network requests are Promise/A+ compliant', () => {
			let xhr,
				requests;

			before(() => {
				xhr = mocks.useFakeXMLHttpRequest();
				requests = [];

				xhr.onCreate = function (req) {
					requests.push(req);
				};
			});

			after(() => {
				xhr.restore();
				thenable = null;
				requests = [];
			});

			it('should emit `beforeFetch` and `beforeAsync` events.', function () {
				let eventSpy = mocks.spy();

				before(() => {
					pc.on('beforeFetch', eventSpy);
					pc.on('beforeAsync', eventSpy);
				});

				thenable = pc.fetch(reqOpts).then(() => {
					eventSpy.should.have.been.calledTwice();
					pc.off('beforeFetch', eventSpy);
					pc.off('beforeAsync', eventSpy);
				});


			});

			it('fetch() makes a network request to: `' + reqOpts.url + '`', () => {
				expect(requests.length).to.equal(1);
				expect(requests[0].url).to.match(new RegExp(reqOpts.url));
			});

			it('and returns an A+ `thenable`', () => {
				expect(thenable).to.respondTo('then');
				expect(thenable).to.respondTo('catch');
				expect(thenable).to.respondTo('finally');
			});
		});

	});


	describe('Can retrieve JSON from a remote endpoint.', () => {
		let server,
			fakeResponse = [{id: 1, text: 'Provide examples', done: true}];

		before(() => {
			server = mocks.fakeServer.create();
		});

		after(() => {
			server.restore();
			thenable = null;
		});

		it('receives JSON back from the API', () => {
			thenable = pc.fetch(reqOpts);
			// This is part of the FakeXMLHttpRequest API
			server.requests[0].respond(
				200,
				{'Content-Type': 'application/json'},
				JSON.stringify(fakeResponse)
			);

			expect(thenable).to.eventually.become(fakeResponse);

		});

		it('Parses returned JSON into an array of Product models', () => {
			pc.parse(fakeResponse);
			expect(pc.models).to.not.be.empty;
			expect(pc.models).to.be.an.instanceof(Array);
			expect(pc.models[0]).to.be.an.instanceof(Product);
		});

	});

	describe('', () => {

	});


});

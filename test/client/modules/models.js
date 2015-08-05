/*eslint no-unused-expressions: 0*/
import {Product, BaseModel} from '../../../lib/client/modules/models';

import {settings} from '../../setup';
import {EmitterMixinBehavior} from '../behaviors/emitter';
import {AsyncDataBehavior} from '../behaviors/async-data';

let expect = settings.assertions.expect;
let mocks = settings.mocking;

settings.init();

describe('Models::Product', () => {
	let p = new Product(),
		reqOpts = {
			url: '/api/product/',
			type: 'json',
			method: 'GET',
			headers: {
				'X-Auth-Token': 'xxxxxxxxx'
			}
		},
		thenable = null;

	it('Inherits from BaseModel.', () => {
		expect(p).to.be.an.instanceof(BaseModel);
	});

	it('Has a constructor name of `Product`.', () => {
		expect(p.constructor).to.deep.equal(Product);
	});

	describe('Handles constructor arguments/options appropriately.', () => {
		let options = {
				testProp: 'success',
				testFunc: () => {
					return true;
				},
				testObj: {
					prop1: new Date(),
					func1: function () {
						return 'test';
					}
				}
			},
			pB;

		before(() => {
			pB = new Product(options);
		});

		after(() => {
			pB = null;
		});

		it('Has a `testProp` property equal to `success` that is a String', () => {
			expect(pB.testProp).to.equal(options.testProp);
			expect(pB.testProp).to.be.a('string');
		});

		it('Has a `testFunc` property equal to a closure that is a Function', () => {
			expect(pB.testFunc).to.equal(options.testFunc);
			expect(pB.testFunc).to.be.a('function');
		});

		it('Has a `testObj` property that is an Object', () => {
			expect(pB.testObj).to.deep.equal(options.testObj);
			expect(pB.testObj).to.be.an('object');
		});
	});

	describe(EmitterMixinBehavior.describe(), EmitterMixinBehavior.test.bind(this, p));

	describe(AsyncDataBehavior.describe(), AsyncDataBehavior.test.bind(this, p, reqOpts));


	describe('Can retrieve JSON from a remote endpoint.', () => {
		let server,
			fakeResponse = [{id: 1, name: 'Acme House Red', price: '$100.00'}];

		before(() => {
			server = mocks.fakeServer.create();
		});

		after(() => {
			server.restore();
			thenable = null;
		});

		it('receives JSON back from the API.', () => {
			thenable = p.fetch(reqOpts);
			// This is part of the FakeXMLHttpRequest API
			server.requests[0].respond(
				200,
				{'Content-Type': 'application/json'},
				JSON.stringify(fakeResponse)
			);

			expect(thenable).to.eventually.become(fakeResponse);

		});

		it('Parses a non-empty response and sets instance properties.', () => {
			p.parse(fakeResponse);
			expect(p.models).to.not.be.empty;
			expect(p.models).to.be.an.instanceof(Array);
			expect(p.models).to.have.length.above(0);
			expect(p.models[0]).to.be.an.instanceof(Product);
		});

		it('Throws an error if response is empty.', () => {
			expect(p.parse.bind(p, {})).to.throw(Error);
		});

		describe('Has methods to return the collection data.', () => {
			it('Implements a `toJSON` method to return the collection as a JSON string.', () => {
				let json;
				expect(p).to.respondTo('toJSON');
				json = p.toJSON();
				//expect(json).to.be.an.instanceof(String);  //fails
				expect(json).to.be.a('string'); //passes
			});

			it('Implements a `serialize` method to return all model attributes as an array of JSON objects.', () => {
				let pojo;
				expect(p).to.respondTo('serialize');
				pojo = p.serialize();
				expect(pojo).to.be.an.instanceof(Array);
				expect(pojo).to.have.length.above(0);
				expect(pojo[0]).to.be.an.instanceof(Object);
			});

		});

	});
});

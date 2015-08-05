/*eslint no-unused-expressions: 0*/
import {BaseCollection, ProductCollection} from '../../../lib/client/modules/collections';
import {BaseModel, Product} from '../../../lib/client/modules/models';

import {inherits} from '../../../lib/client/modules/util';
import {EmitterMixinBehavior} from '../behaviors/emitter';
import {AsyncDataBehavior} from '../behaviors/async-data';
import {settings} from '../../setup';


let expect = settings.assertions.expect;
let mocks = settings.mocking;

settings.init();


describe('Collections::ProductCollection', () => {
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

	beforeEach(() => {

	});

	afterEach(() => {

	});

	before(() => {

	});

	after(() => {

	});

	it('Inherits from BaseCollection.', () => {
		expect(pc).to.be.an.instanceof(BaseCollection);
	});

	it('Has a constructor name of `ProductCollection`.', () => {
		expect(pc.constructor).to.deep.equal(ProductCollection);
	});

	it('Has a `model` property set to `Product`.', () => {
		let model = pc.model;
		expect(model).to.exist;
		expect(model).to.deep.equal(Product);
	});

	describe('Handles constructor arguments/options appropriately.', () => {
		let testModel = function () {
		};
		testModel.prototype = inherits(BaseModel, testModel);

		let options = {
				model: testModel,
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
			pcB;

		before(() => {
			pcB = new ProductCollection(options);
		});

		after(() => {
			pcB = null;
		});

		it('Has a `model` propery equal to `testModel` that is a descendant of BaseModel', () => {
			expect(pcB.model).to.deep.equal(testModel);
			expect(new pcB.model()).to.be.an.instanceof(BaseModel);
		});

		it('Has a `testProp` property equal to `success` that is a String', () => {
			expect(pcB.testProp).to.equal(options.testProp);
			expect(pcB.testProp).to.be.a('string');
		});

		it('Has a `testFunc` property equal to a closure that is a Function', () => {
			expect(pcB.testFunc).to.equal(options.testFunc);
			expect(pcB.testFunc).to.be.a('function');
		});

		it('Has a `testObj` property that is an Object', () => {
			expect(pcB.testObj).to.deep.equal(options.testObj);
			expect(pcB.testObj).to.be.an('object');
		});
	});

	describe(EmitterMixinBehavior.describe(), EmitterMixinBehavior.test.bind(this, pc));

	describe(AsyncDataBehavior.describe(), AsyncDataBehavior.test.bind(this, pc, reqOpts));


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
			thenable = pc.fetch(reqOpts);
			// This is part of the FakeXMLHttpRequest API
			server.requests[0].respond(
				200,
				{'Content-Type': 'application/json'},
				JSON.stringify(fakeResponse)
			);

			expect(thenable).to.eventually.become(fakeResponse);

		});

		it('Parses a non-empty response into an array of Product models.', () => {
			let models = pc.models;
			pc.parse(fakeResponse);
			expect(models).to.not.be.empty;
			expect(models).to.be.an.instanceof(Array);
			expect(models).to.have.length.above(0);
			expect(models[0]).to.be.an.instanceof(Product);
		});

		it('Throws an error if response is empty.', () => {
			expect(pc.parse.bind(pc, {})).to.throw(Error);
		});

		describe('Has methods to return the collection data.', () => {
			it('Implements a `toJSON` method to return the collection as a JSON string.', () => {
				let json;
				expect(pc).to.respondTo('toJSON');
				json = pc.toJSON();
				//expect(json).to.be.an.instanceof(String);  //fails
				expect(json).to.be.a('string'); //passes
			});

			it('Implements a `serialize` method to return all model attributes as an array of JSON objects.', () => {
				let serialized;
				expect(pc).to.respondTo('serialize');
				serialized = pc.serialize();
				expect(serialized).to.be.an.instanceof(Array);
				expect(serialized).to.have.length.above(0);
				expect(serialized[0]).to.be.an.instanceof(Object);
			});

		});

	});


});

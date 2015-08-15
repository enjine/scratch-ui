/*eslint no-unused-expressions: 0*/
import {Product, BaseModel} from '../../../lib/client/modules/models';

import {settings} from '../../setup';
import {EmitterMixinBehavior} from '../behaviors/emitter';
import {AsyncDataBehavior} from '../behaviors/async-data';
import {inherits} from '../../../lib/client/modules/util';

let expect = settings.assertions.expect;
let mocks = settings.mocking;

settings.init();

describe('Models::Base', () => {
	let testModel = function () {
		this.defaults = {
			testProp: null,
			testFunc: () => {
			},
			testObj: null
		};

	};

	inherits(testModel, BaseModel);

});

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
		let values = {
				id: 1,
				name: 'house red',
				soil: 'american',
				price: '$100.00'
			},
			options = {
				test: true
			},
			pB;

		before(() => {
			pB = new Product(values, options);
		});

		after(() => {
			pB = null;
		});

		it('Has a `id` property equal to `' + values.id + '` that is a Number', () => {
			expect(pB.get('id')).to.equal(values.id);
			expect(pB.get('id')).to.be.a('number');
		});

		it('Has a `name` property equal to `' + values.name + '`', () => {
			expect(pB.get('name')).to.equal(values.name);
		});

		it('Has a `soil` property that is equal to `' + values.soil + '`', () => {
			expect(pB.get('soil')).to.deep.equal(values.soil);
		});

		it('Has an options property that is equal to `' + JSON.stringify(options) + '`', () => {
			expect(pB.options).to.deep.equal(options);
		});
	});

	describe(EmitterMixinBehavior.describe(), EmitterMixinBehavior.test.bind(this, p));

	describe(AsyncDataBehavior.describe(), AsyncDataBehavior.test.bind(this, p, reqOpts));


	describe('Can retrieve JSON from a remote endpoint.', () => {
		let server,
			fakeResponse = {id: 1, name: 'Acme House Red', price: '$100.00'};

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
			let props = Object.keys(p.values);
			expect(props).to.not.be.empty;
			expect(p.values).to.be.an.instanceof(Object);
			expect(props).to.have.length.above(0);
		});

		it('If response is empty, returns an instance of Product.', () => {
			expect(p.parse({})).to.be.an.instanceof(Product);
		});

		describe('Has methods to return the model data.', () => {
			let pojo = null;
			describe('Implements a `serialize` method to return all model attributes as a JSON object.', () => {
				it('Responds to `serialize', () => {
					expect(p).to.respondTo('serialize');
				});

				it('Returns an instance of `Object` with an `id` property that is a `Number`', () => {
					pojo = p.serialize();
					expect(pojo).to.be.an.instanceof(Object);
					expect(Object.getOwnPropertyNames(pojo)).to.have.length.above(0);
					expect(pojo.id).to.be.a('number');
				});

				it('Implements a `toJSON` method to return the model as a JSON string.', () => {
					let json;
					expect(p).to.respondTo('toJSON');
					json = p.toJSON();
					//expect(json).to.be.an.instanceof(String);  //fails
					expect(json).to.be.a('string'); //passes
				});
			});


		});

	});
});

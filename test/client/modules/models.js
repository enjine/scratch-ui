/*eslint no-unused-expressions: 0*/
import {Product, BaseModel} from '../../../lib/client/modules/models';

import {settings} from '../../setup';
import {EmitterMixinBehavior} from '../behaviors/emitter';
import {AsyncDataBehavior} from '../behaviors/async-data';
import {inherits} from '../../../lib/client/modules/util';

let expect = settings.assertions.expect;
let mocks = settings.mocking;

settings.init();

describe('Models::Generic', () => {
	let m,
		testModel = function () {
			this.defaults = {
				testProp: 45,
				testFunc: () => {
					return 'computed';
				},
				testObj: null
			};

			BaseModel.apply(this, arguments);
		};

	inherits(testModel, BaseModel);

	beforeEach(() => {
		m = new testModel({
			testObj: {
				r: () => {
				}
			}
		}, {test: true});
	});

	afterEach(() => {
		m = null;
	});

	it('Is an instance of testModel and inherit from BaseModel', () => {
		expect(m).to.be.an.instanceof(testModel);
		expect(m).to.be.an.instanceof(BaseModel);
	});

	describe('Handles arbitrary constructor arguments appropriately', () => {
		it('Supports options arguments', () => {
			expect(m.options).to.exist;
			expect(m.options.test).to.be.true;
		});

		it('Supports default values', () => {
			expect(m.get('testProp')).to.equal(45);
		});

		it('Supports computed properties', () => {
			expect(m.get('testFunc')).to.equal('computed');
		});

		it('Supports objects as properties', () => {
			let o = m.get('testObj');
			expect(o).to.exist;
			expect(o.r).to.be.a('function');
		});

		it('Throws an error if attempting to set a non-declared property', () => {
			expect(m.set.bind(m, 'nonDeclaredProperty', 'nonDeclaredProperty')).to.throw(ReferenceError);
		});

		it('Supports setting arbitrary `custom` prefixed properties', () => {
			expect(m.set.bind(m, 'customProperty', 'testCustomProperty')).to.not.throw(ReferenceError);
			expect(m.get('customProperty')).to.equal('testCustomProperty');
		});

		it('Handles the special `id` attribute appropriately, enforcing it as a `Number`', () => {
			expect(m.set.bind(m, 'id', 123)).not.to.throw(TypeError);
			expect(m.set.bind(m, 'id', '123')).not.to.throw(TypeError);
			expect(m.set.bind(m, 'id', 'ABC')).to.throw(TypeError);
			expect(m.get('id')).to.be.a('number');
		});
	});

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

	it('Has accessor methods', () => {
		expect(p).to.respondTo('get');
		expect(p).to.respondTo('set');
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
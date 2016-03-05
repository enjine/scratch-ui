/*eslint no-unused-expressions: 0*/
import Collection from '../../../src/client/com.e750/lib/classes/collections/Collection';
import ProductCollection from '../../../src/client/com.e750/lib/classes/collections/Product';

import Model from '../../../src/client/com.e750/lib/classes/models/Model';
import ProductModel from '../../../src/client/com.e750/lib/classes/models/Product';

import {EmitterMixinBehavior} from '../behaviors/emitter';
import {AsyncDataBehavior} from '../behaviors/async-data';
import {settings} from '../../setup';


let expect = settings.assertions.expect;
let mocks = settings.mocking;

settings.init();

let c = new Collection(),
    pc = new ProductCollection(),
    reqOpts = {
        url: '/api/products',
        headers: {
            'X-Auth-Token': 'xxxxxxxxx'
        }
    },
    thenable = null;


describe('Collections::Base', () => {
    it('Has a `model` property set to `Model`.', () => {
        let model = c.model;
        expect(model).to.exist;
        expect(model).to.deep.equal(Model);
    });
});

describe('Collections::ProductCollection', () => {


    beforeEach(() => {

    });

    afterEach(() => {

    });

    before(() => {

    });

    after(() => {

    });

    it('Has a `model` property set to `Product`.', () => {
        let model = pc.model;
        expect(model).to.exist;
        expect(model).to.deep.equal(ProductModel);
    });

    describe('Handles constructor arguments/options appropriately.', () => {
        class testModel extends Model {
        }
        let data = [
                {id: 1, name: 'house red'},
                {id: 2, name: 'house white'},
                {id: 3, name: 'house rosè'}
            ],
            options = {
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
            pcB = new ProductCollection(data, options);
        });

        after(() => {
            pcB = null;
        });

        it('Has a `model` propery equal to `testModel`', () => {
            expect(pcB.model).to.deep.equal(testModel);
        });

        it('Has a `testProp` property equal to `success` that is a String', () => {
            expect(pcB.options.testProp).to.equal(options.testProp);
            expect(pcB.options.testProp).to.be.a('string');
        });

        it('Has a `testFunc` property equal to a closure that is a Function', () => {
            expect(pcB.options.testFunc).to.equal(options.testFunc);
            expect(pcB.options.testFunc).to.be.a('function');
        });

        it('Has a `testObj` property that is an Object', () => {
            expect(pcB.options.testObj).to.deep.equal(options.testObj);
            expect(pcB.options.testObj).to.be.an('object');
        });
    });

    describe(EmitterMixinBehavior.describe(), EmitterMixinBehavior.test.bind(this, pc));

    describe(AsyncDataBehavior.describe(), AsyncDataBehavior.test.bind(this, pc, reqOpts));


    describe('Can retrieve JSON from a remote endpoint.', () => {
        let fakeResponse = JSON.stringify([{id: 1, name: 'Acme House Red', price: '$100.00'}], null, 2);

        before(() => {
            mocks.stub(window, 'fetch');

            let res = new window.Response(fakeResponse, {
                    status: 200,
                    statusText: 'OK',
                    headers: {
                        'Content-type': 'application/json'
                    }
                });
            window.fetch.returns(Promise.resolve(res));
        });

        after(() => {
            window.fetch.restore();
            thenable = null;
        });

        it('receives JSON back from the API.', () => {
            thenable = pc.fetch(reqOpts);
            expect(thenable).to.eventually.become(fakeResponse);

        });

        it('Parses a non-empty response into an array of Product models.', () => {
            let models = pc.models;
            pc.parse(fakeResponse);
            expect(models).to.not.be.empty;
            expect(models).to.be.an.instanceof(Array);
            expect(models).to.have.length.above(0);
            expect(models[0]).to.be.an.instanceof(ProductModel);
        });

        it('If response is empty, it returns a blank instance of a ProductCollection.', () => {
            expect(pc.parse([])).to.be.an.instanceof(ProductCollection);
        });

        describe('Has methods to return the collection data.', () => {
            it('Implements a `toJSON` method to return the collection as a JSON string.', () => {
                let json;
                expect(pc).to.respondTo('toJSON');
                json = pc.toJSON();
                //expect(json).to.be.an.instanceof(String);  //fails
                expect(json).to.be.a('string'); //passes
            });

            it('Implements a `toMeta` method to return apply transforms and return custom data.' +
                'before returning as a JSON string.', () => {
                let json;
                expect(pc).to.respondTo('toMeta');
                json = pc.toJSON();
                expect(json).to.be.a('string'); //passes
            });

            it('Implements a `serialize` method to return all model attributes as an array of JS objects.', () => {
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

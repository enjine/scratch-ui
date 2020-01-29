/*eslint no-unused-expressions: 0*/

import {settings} from 'setup';

let expect = settings.assertions.expect;
//let mocks = settings.mocking;
//let mockRequest = settings.net.mock;
//let net = settings.net.request;

settings.init();

import Collection from 'lib/classes/collections/Collection';
import Model from 'lib/classes/models/Model';
import Product from 'lib/classes/models/Product';

let C;

describe('Collection.class', () => {
    beforeEach(() => {

    });

    describe('constructor()', () => {
        it('Handles arguments correctly', () => {
            C = new Collection([{test: 1}, {test: 2}]);
            expect(C.model).to.be.an.instanceOf(Model);
            expect(C.models.length).to.equal(2);
            expect(C.models[1].get('test')).to.equal(2);

            C = new Collection([], {modelClass: Product});
            expect(C.model).to.be.an.instanceOf(Product);
            expect(C.models.length).to.equal(0);
        });
    });


    describe('add()', () => {
        it('add single values and arrays', () => {
            C = new Collection();
            C.add({wham: 'eggs'});
            C.add([{clam: 'sock'}, {eep: 'opp'}]);
            expect(C.length()).to.equal(3);
        });
    });


    it('remove (index)', () => {

    });

    it('length ()', () => {

    });

    it('parse (data)', () => {

    });

    it('serialize ()', () => {

    });

    it('toJSON ()', () => {

    });

    it('toMeta (transformer, options)', () => {

    });

    it('request (url, options)', () => {

    });

    it('verifyResource (url) ', () => {

    });

    it('fetch (options = {})', () => {

    });

    it('get (index)', () => {

    });

    it('save (options = {})', () => {

    });

    /*post (options = {}) {
     options.method = 'POST';
     console.log('POST:', options);
     }

     put (options = {}) {
     options.method = 'PUT';
     console.log('PUT:', options);
     }

     del (options = {}) {
     options.method = 'DELETE';
     console.log('DEL:', options);
     }*/

    it('onParseFailed()', () => {

    });
});

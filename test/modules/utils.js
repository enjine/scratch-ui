/*eslint no-unused-expressions: 0*/
import DOMUtils from '../../src/client/com.e750/lib/util/DOMUtils';
import LookupTable from '../../src/client/com.e750/lib/util/LookupTable';

import {settings} from '../setup';

let expect = settings.assertions.expect;

settings.init();

describe('Utils', () => {
    describe('defaults', () => {

    });

    describe('HTML2DOM', () => {
        it('Accepts an HTML string and returns a DOMNode, stripping <script> tags', () => {
            let testHTMLStr = '<div><h1>Hello and welcome</h1><script>alert(\'HA HA!\');</script></div>',
                result = DOMUtils.htmlToDom(testHTMLStr);
            expect(result).to.be.an.instanceof(Element);
            expect(result).to.be.an.instanceof(Node);
            expect(result.querySelector('script')).to.equal(null);
        });
    });

    describe('LookupTable', () => {
        let L;

        beforeEach(() => {
            L = Object.create(LookupTable);
        });


        it('add("someKey", "someValue") should return true if a valid value is added. (anything other than undefined)', () => {
            let ret = L.add('string', 'hello');
            expect(ret).to.equal(true);

        });

        it('add("someKey", undefined) Should return false if an invalid value is added (undefined).', () => {
            let ret = L.add('undefined', undefined);
            expect(ret).to.equal(false);

        });

        it('add("existingKey", "someValue") should throw a ReferenceError if you attempt to set a value twice.', () => {
            L.add('duplicate', 'yes');
            expect(L.add.bind(L, 'duplicate', 'no')).to.throw(ReferenceError);

        });

        it('remove("existingKey") to remove the requested value.', () => {
            L.add('removeMe', 'yes');
            expect(L.has('removeMe')).to.equal(true);
            L.remove('removeMe');
            expect(L.has('removeMe')).to.equal(false);

        });

        it('remove("nonExistentKey") to throw a ReferenceError.', () => {

            expect(L.remove.bind(L, 'removeMe')).to.throw(ReferenceError);

        });

        it('size() should return the number of items it contains.', () => {
            L.add('integer', 450);
            L.add('zero', 0);
            L.add('null', null);
            L.add('object', {test: true});
            L.add('array', [1, 2, 3, 4]);
            L.true = true;
            L.false = false;
            expect(L.size()).to.equal(7);

        });

        it('has() should return true if it contains a specific key and false it does not.', () => {
            L.add('null', null);
            expect(L.has('null')).to.equal(true);
            expect(L.has('nonExistentKey')).to.equal(false);
        });

        it('all() should return an object containing all entries.', () => {
            L.add('integer', 450);
            L.add('zero', 0);
            L.add('null', null);
            L.add('object', {test: true});
            L.add('array', [1, 2, 3, 4]);
            L.true = true;
            L.false = false;

            let ret = {
                integer: 450,
                zero: 0,
                'null': null,
                'object': {test: true},
                'array': [1, 2, 3, 4],
                'true': true,
                'false': false
            };
            expect(L.all()).to.deep.equal(ret);
        });

        it('toArray() should return an array of objects {key: keyName, value: value} for all entries.', () => {
            L.add('integer', 450);
            L.add('zero', 0);
            L.add('null', null);
            L.add('object', {test: true});
            L.add('array', [1, 2, 3, 4]);
            L.true = true;
            L.false = false;

            let ret = [
                {key: 'integer', value: 450},
                {key: 'zero', value: 0},
                {key: 'null', value: null},
                {key: 'object', value: {test: true}},
                {key: 'array', value: [1, 2, 3, 4]},
                {key: 'true', value: true},
                {key: 'false', value: false}
            ];
            expect(L.toArray()).to.deep.equal(ret);

        });

    });

});

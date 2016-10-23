/*eslint no-unused-expressions: 0*/

import {settings} from 'setup';

let expect = settings.assertions.expect;
//let mocks = settings.mocking;
//let mockRequest = settings.net.mock;
//let net = settings.net.request;

settings.init();

import guid from 'lib/util/guid';

describe('Utils/guid', () => {
    it('Generates an  RFC4122 version 4 compliant identifier', () => {
        let g = guid();
        expect(g).to.be.ok;
        expect(g.length).to.equal(36);
    });
});

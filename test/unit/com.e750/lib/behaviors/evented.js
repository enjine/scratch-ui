/*eslint no-unused-expressions: 0*/

import {settings} from 'setup';

//let expect = settings.assertions.expect;
//let mocks = settings.mocking;
//let mockRequest = settings.net.mock;
//let net = settings.net.request;

settings.init();

import Evented from 'lib/behaviors/Evented';

describe('Evented.mixin', () => {
    it('', () => {
        console.log(Evented);
    });
});

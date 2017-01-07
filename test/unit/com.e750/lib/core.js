/*eslint no-unused-expressions: 0*/

import {settings} from 'setup';

//let expect = settings.assertions.expect;
//let mocks = settings.mocking;
//let mockRequest = settings.net.mock;
//let net = settings.net.request;

settings.init();

import {net, storage, jst} from 'lib/core';

describe('Lib/core', () => {
    describe('net', () => {
        xit('http.exec', () => {
            console.log(net.http.exec);
        });

        xit('http.getJSON', () => {
            console.log(net.http.getJSON);
        });

        xit('http.postJSON', () => {
            console.log(net.http.postJSON);
        });

        xit('http.get', () => {
            console.log(net.http.get);
        });

        xit('http.post', () => {
            console.log(net.http.post);
        });

        xit('http.put', () => {
            console.log(net.http.put);
        });

        xit('http.del', () => {
            console.log(net.http.del);
        });
    });

    describe('storage', () => {
        xit('cookie', () => {
            console.log(storage.cookie);
        });
    });

    describe('jst', () => {
        it('getFromDom', () => {
            console.log(jst.getFromDom);
        });

        xit('compile', () => {
            console.log(jst.compile);
        });

        xit('compileToDOM', () => {
            console.log(jst.compileToDOM);
        });
    });
});

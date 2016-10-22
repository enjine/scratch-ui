/*eslint no-unused-expressions: 0*/
import {settings} from '../setup';
import Evt from 'lib/event/Registry';
import Model from 'lib/classes/models/Model';

let mocks = settings.mocking;
let chai = settings.assertions;
let expect = chai.expect;
let mockRequest = settings.net.mock;
let net = settings.net.request;

settings.init();

describe('Can make network requests.', function () {
    let o = new Model(),
        thenable,
        reqOpts = {
            method: 'GET',
            url: '/api/product/23',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Auth-Token': 'xxxxxxxxx'
            }
        };

    it('Implements fetch()', () => {
        expect(o).to.respondTo('fetch');
    });

    it('Request options should have an X-Auth-Token header property`.', () => {
        expect(reqOpts.headers).to.exist;
        expect(reqOpts.headers['X-Auth-Token']).to.exist;
    });

    describe('Network requests fire events and return native Promises.', () => {
        let fakeResponse = {success: true};

        before(() => {
            mockRequest.onGet(/.*/).reply(config => {
                console.log('MOCK XHR: ', config);
                return [200, fakeResponse];
            });
            mocks.stub(o, 'request', function (url, options) {
                options.url = url;
                o.emit(Evt.BEFORE_XHR);
                return net.request(options);
            });
        });

        after(() => {
            o.request.restore();
            mockRequest.reset();
        });

        it('should emit `beforeRequest` and `beforeXHR` event.', function () {
            let eventSpy;
            eventSpy = mocks.spy();
            o.on(Evt.BEFORE_REQUEST, eventSpy);
            o.on(Evt.BEFORE_XHR, eventSpy);

            thenable = o.fetch(reqOpts).then((response) => {
                console.log('MOCK XHR Response: ', response);
                o.off(Evt.BEFORE_REQUEST, eventSpy);
                o.off(Evt.BEFORE_XHR, eventSpy);
                return eventSpy.should.have.been.calledTwice;
            });

            return thenable;
        });

        it('should return a native Promise', () => {
            expect(thenable).to.respondTo('then');
            expect(thenable).to.respondTo('catch');
        });
    });
});

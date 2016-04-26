/*eslint no-unused-expressions: 0*/
import {settings} from '../../setup';


let mocks = settings.mocking;
let chai = settings.assertions;
let expect = chai.expect;

settings.init();

export var AsyncDataBehavior = {
    describe: function () {
        return 'Can make network requests.';
    },
    test: function (o, reqOpts) {
        let thenable;

        it('Implements fetch()', () => {
            expect(o).to.respondTo('fetch');
        });

        it('Request options should have an X-Auth-Token header property`.', () => {
            expect(reqOpts.headers).to.exist;
            expect(reqOpts.headers['X-Auth-Token']).to.exist;
        });

        describe('Network requests fire events and return native Promises.', () => {
            before(() => {
                mocks.stub(window, 'fetch');

                let res = new window.Response(JSON.stringify('{"success":true}'), {
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
            });

            it('should emit `beforeFetch` and `beforeAsync` event.', function () {
                let eventSpy = mocks.spy();

                before(() => {
                    o.on('beforeFetch', eventSpy);
                    o.on('beforeAsync', eventSpy);
                });

                thenable = o.fetch(reqOpts).then(() => {
                    eventSpy.should.have.been.calledTwice;
                    o.off('beforeFetch', eventSpy);
                    o.off('beforeAsync', eventSpy);
                });


            });

            it('should return a native Pronise.', () => {
                expect(thenable).to.respondTo('then');
                expect(thenable).to.respondTo('catch');
            });
        });
    }
};

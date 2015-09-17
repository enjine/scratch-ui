/*eslint no-unused-expressions: 0*/
import {settings} from '../../setup';


let mocks = settings.mocking;
let chai = settings.assertions;
let expect = chai.expect;

settings.init();

export var AsyncDataBehavior = {
	describe: function () {
		return 'Can make network requests via a `fetch()` method.';
	},
	test: function (o, reqOpts) {
		let thenable;

		it('Implements fetch()', () => {
			expect(o).to.respondTo('fetch');
		});

		it('Request options should have a request type of `JSON`.', () => {
			expect(reqOpts.type).to.exist;
			chai.assert.match(reqOpts.type, /json/i);
		});

		it('Request options should have a request method of `GET`.', () => {
			expect(reqOpts.method).to.exist;
			chai.assert.match(reqOpts.method, /get/i);
		});

		it('Request options should have an X-Auth-Token header property`.', () => {
			expect(reqOpts.headers).to.exist;
			expect(reqOpts.headers['X-Auth-Token']).to.exist;
		});

		describe('Network requests are Promise/A+ compliant.', () => {
			let xhr,
				requests;

			before(() => {
				xhr = mocks.useFakeXMLHttpRequest();
				requests = [];

				xhr.onCreate = function (req) {
					requests.push(req);
				};
			});

			after(() => {
				xhr.restore();
				thenable = null;
				requests = [];
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

			it('`fetch()` makes a network request to: `' + reqOpts.url + '`.', () => {
				expect(requests.length).to.equal(1);
				expect(requests[0].url).to.match(new RegExp(reqOpts.url));
			});

			it('and returns an A+ `thenable`.', () => {
				expect(thenable).to.respondTo('then');
				expect(thenable).to.respondTo('catch');
				expect(thenable).to.respondTo('finally');
			});
		});
	}
};

/*eslint no-unused-expressions: 0*/

import {settings} from 'setup';
import compose from 'lib/util/compose';

let expect = settings.assertions.expect;
//let mocks = settings.mocking;
//let mockRequest = settings.net.mock;
//let net = settings.net.request;

settings.init();

import Progressable from 'lib/behaviors/Progressable';

class testClass extends compose(Progressable) {
    constructor () {
        super();
        this.el = document.createElement('div');
    }
}

var testFunc = function () {
    this.el = document.createElement('figure');
};

testFunc.prototype = new Progressable();

let testeeC,
    testeeF;

describe('Progressable.mixin', function ()  {
    beforeEach(() => {
        testeeC = new testClass();
        testeeF = new testFunc();
    });
    it('Must be mixed into an object with the `el` property set to a DOM element)', () => {
        expect(testeeC.el).to.be.ok;
        expect(testeeF.el).to.be.ok;
        expect(testeeC.el).to.respondTo('appendChild');
        expect(testeeF.el).to.respondTo('appendChild');
        expect(testeeC).to.respondTo('showProgress');
        expect(testeeF).to.respondTo('showProgress');
        expect(testeeC).to.respondTo('hideProgress');
        expect(testeeF).to.respondTo('hideProgress');
        expect(testeeC).to.respondTo('onProgress');
        expect(testeeF).to.respondTo('onProgress');
    });

    it('Throws when the required properties/methods are not implemented', function () {
        delete testeeF.el;
        delete testeeC.el;
        expect(testeeF.showProgress.bind(testeeF)).to.throw(Error);
        expect(testeeC.showProgress.bind(testeeC)).to.throw(Error);
        expect(testeeF.hideProgress.bind(testeeF)).to.throw(Error);
        expect(testeeC.hideProgress.bind(testeeC)).to.throw(Error);
    });
});

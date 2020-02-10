/*eslint no-unused-expressions: 0*/

import { settings } from "setup";
import compose from "lib/util/compose";

let expect = settings.assertions.expect;
//let mocks = settings.mocking;
//let mockRequest = settings.net.mock;
//let net = settings.net.request;

settings.init();

import Progressable from "lib/behaviors/Progressable";

class testClass extends compose(Progressable) {
  constructor() {
    super();
    this.el = document.createElement("div");
  }
}

var testFunc = function() {
  this.el = document.createElement("figure");
};

testFunc.prototype = new Progressable();

let testeeC, testeeF;

describe("Progressable.mixin", function() {
  beforeEach(() => {
    testeeC = new testClass();
    testeeF = new testFunc();
  });
  it("Must be mixed into an object with the `el` property set to a DOM element and have  <progress> element as a child)", () => {
    let pF = document.createElement("progress"),
      pC = document.createElement("progress");
    testeeF.el.appendChild(pF);
    testeeC.el.appendChild(pC);

    expect(testeeC.el).to.be.ok;
    expect(testeeC.el).to.be.ok;
    expect(testeeF.el.children.length).to.equal(1);
    expect(testeeC.el.children.length).to.equal(1);
    expect(testeeC.el).to.respondTo("appendChild");
    expect(testeeF.el).to.respondTo("appendChild");
    expect(testeeC).to.respondTo("showProgress");
    expect(testeeF).to.respondTo("showProgress");
    expect(testeeC).to.respondTo("hideProgress");
    expect(testeeF).to.respondTo("hideProgress");
    expect(testeeC).to.respondTo("onProgress");
    expect(testeeF).to.respondTo("onProgress");
    expect(
      testeeF.onProgress.bind(testeeF, { data: { lengthComputable: false } })
    ).not.to.throw(Error);
    expect(
      testeeC.onProgress.bind(testeeC, {
        data: { lengthComputable: true, total: 1024, loaded: 10 }
      })
    ).not.to.throw(Error);
    expect(testeeF.hideProgress.bind(testeeF)).not.to.throw(Error);
    expect(testeeC.hideProgress.bind(testeeC)).not.to.throw(Error);
  });

  it("Throws when the required properties/methods are not implemented", function() {
    delete testeeF.el;
    delete testeeC.el;
    expect(testeeF.showProgress.bind(testeeF)).to.throw(Error);
    expect(testeeC.showProgress.bind(testeeC)).to.throw(Error);
    expect(testeeF.hideProgress.bind(testeeF)).to.throw(Error);
    expect(testeeC.hideProgress.bind(testeeC)).to.throw(Error);
  });

  it("Throws when there is no <progress> element present", function() {
    expect(testeeF.hideProgress.bind(testeeF)).to.throw(Error);
    expect(testeeC.hideProgress.bind(testeeC)).to.throw(Error);
  });
});

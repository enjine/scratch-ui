/*eslint no-unused-expressions: 0*/

import { settings } from "setup";

let expect = settings.assertions.expect;
//let mocks = settings.mocking;
//let mockRequest = settings.net.mock;
//let net = settings.net.request;

settings.init();

import nEvent from "lib/event/nEvent";

describe("Event/nEvent", () => {
  it("Creates a custom event object", function() {
    let e = new nEvent("smoosh", { test: true }, this),
      e2 = nEvent("moosh", { winning: true });

    expect(e).to.be.an.instanceOf(nEvent);
    expect(e2).to.be.an.instanceOf(nEvent);

    expect(this.type).to.be.undefined;
    expect(this.data).to.be.undefined;
    expect(this.target).to.be.undefined;
    expect(this.cancelled).to.be.undefined;

    expect(e.type).to.equal("smoosh");
    expect(e.data).to.deep.equal({ test: true });
    expect(e.target).to.equal(this);
    expect(e.cancelled).to.be.falsy;

    expect(e2.type).to.equal("moosh");
    expect(e2.data).to.deep.equal({ winning: true });
    expect(e2.target).to.equal(null);
    expect(e2.cancelled).to.be.falsy;
  });
});

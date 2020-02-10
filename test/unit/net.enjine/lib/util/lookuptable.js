/*eslint no-unused-expressions: 0*/

import { settings } from "setup";

let expect = settings.assertions.expect;
//let mocks = settings.mocking;
//let mockRequest = settings.net.mock;
//let net = settings.net.request;

settings.init();

import LookupTable from "lib/util/LookupTable";

let testee;

describe("Utils/LookupTable", () => {
  beforeEach(() => {
    testee = Object.create(LookupTable);
  });
  it("add()", () => {
    expect(testee.length).to.equal(0);
    testee.add("test", true);
    expect(testee.length).to.equal(1);
    testee.add("test2", true);
    expect(testee.length).to.equal(2);
    testee.add("test3", true);
    expect(testee.length).to.equal(3);
    expect(testee.has("test")).to.be.ok;
    expect(testee.has("test2")).to.be.ok;
    expect(testee.has("test3")).to.be.ok;
  });
  it("remove()", () => {
    expect(testee.length).to.equal(0);
    testee.add("test", true);
    testee.add("test1", true);
    testee.add("test2", true);
    expect(testee.length).to.equal(3);
    testee.remove("test2");
    expect(testee.length).to.equal(2);
    testee.remove("test");
    expect(testee.has("test")).to.be.falsy;
    expect(testee.has("test2")).to.be.falsy;
    expect(testee.has("test1")).to.be.ok;
    expect(testee.length).to.equal(1);
  });
  it("all()", () => {
    expect(testee.length).to.equal(0);
    testee.add("test", true);
    testee.add("test1", "yay");
    testee.add("test2", "nay");
    let all = testee.all();
    Object.keys(all).forEach(key => {
      let value = all[key];
      expect(testee.has(key)).to.be.ok;
      expect(value).to.be.ok;
    });
  });
  it("toArray()", () => {
    testee.add("test", true);
    testee.add("test1", "yay");
    testee.add("test2", "nay");
    let values = testee.toArray();
    expect(values).to.be.an.instanceOf(Array);
    expect(values.length).to.equal(3);
    expect(values[1].key).to.equal("test1");
    expect(values[1].value).to.equal("yay");
  });
  it("reset()", () => {
    testee.add("test", true);
    testee.add("test1", "yay");
    testee.add("test2", "nay");
    testee.add("test3", "meh");
    expect(testee.size()).to.equal(4);
    expect(testee.length).to.equal(4);
    testee.reset();
    expect(testee.size()).to.equal(0);
    expect(testee.length).to.equal(0);
  });
  it("has()", () => {
    testee.add("test", true);
    testee.add("test1", "yay");
    testee.add("test2", "nay");
    testee.add("test3", "meh");
    expect(testee.has("test2")).to.be.ok;
  });
  it("size()", () => {
    testee.add("test", true);
    testee.add("test1", "yay");
    testee.add("test2", "nay");
    testee.add("test3", "meh");
    testee.add("test4", "hag");
    expect(testee.size()).to.equal(5);
  });
  it("length()", () => {
    testee.add("test2", "nay");
    testee.add("test3", "meh");
    testee.add("test4", "hag");
    testee.add("test", true);
    testee.add("test1", "yay");
    testee.add("zzzzz", "yay");
    expect(testee.length).to.equal(6);
  });
});

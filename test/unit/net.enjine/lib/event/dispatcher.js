/*eslint no-unused-expressions: 0*/

import { settings } from "setup";

//let expect = settings.assertions.expect;
//let mocks = settings.mocking;
//let mockRequest = settings.net.mock;
//let net = settings.net.request;

settings.init();

import Dispatcher from "lib/event/Dispatcher";

xdescribe("Event/Dispatcher", () => {
  it("", () => {
    console.log(Dispatcher);
  });
});

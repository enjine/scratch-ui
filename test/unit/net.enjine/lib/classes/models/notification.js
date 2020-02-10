/*eslint no-unused-expressions: 0*/

import { settings } from "setup";

//let expect = settings.assertions.expect;
//let mocks = settings.mocking;
//let mockRequest = settings.net.mock;
//let net = settings.net.request;

settings.init();

import Notification from "lib/classes/models/Notification";

xdescribe("Notification.class", () => {
  it("Creates a new Notification model class", () => {
    console.log(Notification);
  });
});

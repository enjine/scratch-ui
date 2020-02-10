/*eslint no-unused-expressions: 0*/

import { settings } from "setup";

//let expect = settings.assertions.expect;
//let mocks = settings.mocking;
//let mockRequest = settings.net.mock;
//let net = settings.net.request;

settings.init();

import {
  compose,
  curry,
  mixes,
  guid,
  anyIntBetween,
  getRandomArbitrary
} from "lib/util/core";
describe("Utils/core", () => {
  xit("compose", () => {
    console.log(compose);
  });

  xit("curry", () => {
    console.log(curry);
  });

  xit("mixes", () => {
    console.log(mixes);
  });

  xit("guid", () => {
    console.log(guid);
  });

  xit("anyIntBetween", () => {
    console.log(anyIntBetween);
  });

  xit("getRandomArbitrary", () => {
    console.log(getRandomArbitrary);
  });
});

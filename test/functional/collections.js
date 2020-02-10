/*eslint no-unused-expressions: 0*/
import Collection from "lib/classes/collections/Collection";
import ProductCollection from "lib/classes/collections/Product";

import Model from "lib/classes/models/Model";
import ProductModel from "lib/classes/models/Product";

import { settings } from "setup";
import Evt from "lib/event/Registry";

import { EmitterMixinBehavior } from "behaviors/emitter";
import { PubSubBehavior } from "behaviors/pubsub";

let expect = settings.assertions.expect;
let mocks = settings.mocking;
let mockRequest = settings.net.mock;
let net = settings.net.request;

settings.init();

let c = new Collection(),
  pc = new ProductCollection(),
  reqOpts = {
    url: "/api/products",
    headers: {
      "X-Auth-Token": "xxxxxxxxx"
    }
  },
  thenable = null;

describe("Collections::Base", () => {
  it("Has a `models` property set to `Model`.", () => {
    let modelClass = c.modelClass;
    expect(modelClass).to.exist;
    expect(modelClass).to.deep.equal(Model);
  });
});

describe("Collections::ProductCollection", () => {
  describe("Handles constructor arguments/options appropriately.", () => {
    class testModel extends Model {}
    let data = [
        { id: 1, name: "house red" },
        { id: 2, name: "house white" },
        { id: 3, name: "house rosè" }
      ],
      options = {
        modelClass: testModel,
        testProp: "success",
        testFunc: () => {
          return true;
        },
        testObj: {
          prop1: new Date(),
          func1: function() {
            return "test";
          }
        }
      },
      pcA,
      pcB;

    beforeEach(() => {
      pcA = new ProductCollection(data);
      pcB = new ProductCollection(data, options);
    });

    afterEach(() => {
      pcA = null;
      pcB = null;
    });

    it("Properly sets `models` property from options.", () => {
      expect(pcA.modelClass).to.deep.equal(ProductModel);
      expect(pcB.modelClass).to.deep.equal(testModel);
    });

    it("Has a `testProp` property equal to `success` that is a String", () => {
      expect(pcB.options.testProp).to.equal(options.testProp);
      expect(pcB.options.testProp).to.be.a("string");
    });

    it("Has a `testFunc` property equal to a closure that is a Function", () => {
      expect(pcB.options.testFunc).to.equal(options.testFunc);
      expect(pcB.options.testFunc).to.be.a("function");
    });

    it("Has a `testObj` property that is an Object", () => {
      expect(pcB.options.testObj).to.deep.equal(options.testObj);
      expect(pcB.options.testObj).to.be.an("object");
    });
  });

  describe(
    EmitterMixinBehavior.describe(),
    EmitterMixinBehavior.test.bind(this, pc)
  );
  describe(PubSubBehavior.describe(), PubSubBehavior.test.bind(this, pc));

  describe("Can retrieve JSON from a remote endpoint.", () => {
    let fakeCollectionResponse = JSON.stringify(
      [{ id: 1, name: "Acme House Red", price: "$100.00" }],
      null,
      2
    );

    before(() => {
      mockRequest.onGet(/.*/).reply(() => {
        return [200, fakeCollectionResponse];
      });
      mocks.stub(pc, "request").callsFake(function(url, options) {
        options.url = url;
        pc.emit(Evt.BEFORE_XHR);
        return net.request(options);
      });
    });

    after(() => {
      pc.request.restore();
      mockRequest.reset();
      thenable = null;
    });

    it("receives JSON back from the API.", () => {
      thenable = pc.request(reqOpts.url, reqOpts).then(response => {
        console.debug(response);
        expect(response.data).to.deep.equal(JSON.parse(fakeCollectionResponse));
      });

      return thenable;
    });

    it("Parses a non-empty response into an array of Product models.", () => {
      pc.parse(JSON.parse(fakeCollectionResponse));
      let models = pc.models;
      expect(models).to.not.be.empty;
      expect(models).to.be.an.instanceof(Array);
      expect(models).to.have.length.above(0);
      expect(models[0]).to.be.an.instanceof(ProductModel);
    });

    it("If response is empty, it returns a blank instance of a ProductCollection.", () => {
      expect(pc.parse([])).to.be.an.instanceof(ProductCollection);
    });

    describe("Has methods to return the collection data.", () => {
      it("Implements a `toJSON` method to return the collection as a JSON string.", () => {
        let json;
        expect(pc).to.respondTo("toJSON");
        json = pc.toJSON();
        //expect(json).to.be.an.instanceof(String);  //fails
        expect(json).to.be.a("string"); //passes
      });

      it(
        "Implements a `toMeta` method to return apply transforms and return custom data." +
          "before returning as a JSON string.",
        () => {
          let json;
          expect(pc).to.respondTo("toMeta");
          json = pc.toJSON();
          expect(json).to.be.a("string");
        }
      );

      it("Implements a `serialize` method to return all models attributes as an array of JS objects.", () => {
        let serialized;
        expect(pc).to.respondTo("serialize");
        serialized = pc.serialize();
        expect(serialized).to.be.an.instanceof(Array);
        expect(serialized).to.have.length.above(0);
        expect(serialized[0]).to.be.an.instanceof(Object);
      });
    });
  });
});

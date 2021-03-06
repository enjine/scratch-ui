/*eslint no-unused-expressions: 0*/
import Model from "lib/classes/models/Model";
import ProductModel from "lib/classes/models/Product";

import { settings } from "setup";
import { EmitterMixinBehavior } from "behaviors/emitter";
import { PubSubBehavior } from "behaviors/pubsub";

let expect = settings.assertions.expect;
let mocks = settings.mocking;
let mockRequest = settings.net.mock;
let net = settings.net.request;

settings.init();

describe("Models::Generic", () => {
  let m;

  class testModel extends Model {}

  beforeEach(() => {
    m = new testModel(
      {
        testObj: {
          r: () => {}
        },
        testFunc: function() {
          return "computed " + this.get("testProp");
        },
        testProp: 45
      },
      { test: true }
    );
  });

  afterEach(() => {
    m = null;
  });

  describe("Handles arbitrary constructor arguments appropriately", () => {
    it("Supports options arguments", () => {
      expect(m.options).to.exist;
      expect(m.options.test).to.be.true;
    });

    it("Supports default values", () => {
      expect(m.get("testProp")).to.equal(45);
    });

    it("Supports computed properties", () => {
      expect(m.get("testFunc")).to.equal("computed 45");
    });

    it("Supports objects as properties", () => {
      let o = m.get("testObj");
      expect(o).to.exist;
      expect(o.r).to.be.a("function");
    });

    xit("Throws an error if attempting to set a non-declared property", () => {
      expect(
        m.set.bind(m, "nonDeclaredProperty", "nonDeclaredProperty")
      ).to.throw(ReferenceError);
    });

    xit("Supports setting arbitrary `custom` prefixed properties", () => {
      expect(
        m.set.bind(m, "customProperty", "testCustomProperty")
      ).to.not.throw(ReferenceError);
      expect(m.get("customProperty")).to.equal("testCustomProperty");
    });

    it("Handles the special `id` attribute appropriately, enforcing it as a `Number`", () => {
      expect(m.set.bind(m, "id", 123)).not.to.throw(TypeError);
      expect(m.set.bind(m, "id", "123")).not.to.throw(TypeError);
      expect(m.set.bind(m, "id", "ABC")).to.throw(TypeError);
      expect(m.get("id")).to.be.a("number");
    });
  });
});

describe("Models::Product", () => {
  let p = new ProductModel();

  it("Has a constructor name of `Product`.", () => {
    expect(p.constructor).to.deep.equal(ProductModel);
  });

  it("Has accessor methods", () => {
    expect(p).to.respondTo("get");
    expect(p).to.respondTo("set");
  });

  describe("Handles constructor arguments/options appropriately.", () => {
    let values = {
        id: 1,
        name: "house red",
        soil: "american",
        price: "$100.00"
      },
      options = {
        test: true
      },
      pB;

    before(() => {
      pB = new ProductModel(values, options);
    });

    after(() => {
      pB = null;
    });

    it(
      "Has a `id` property equal to `" + values.id + "` that is a Number",
      () => {
        expect(pB.get("id")).to.equal(values.id);
        expect(pB.get("id")).to.be.a("number");
      }
    );

    it("Has a `name` property equal to `" + values.name + "`", () => {
      expect(pB.get("name")).to.equal(values.name);
    });

    it("Has a `soil` property that is equal to `" + values.soil + "`", () => {
      expect(pB.get("soil")).to.deep.equal(values.soil);
    });

    it(
      "Has an options property that is equal to `" +
        JSON.stringify(options) +
        "`",
      () => {
        expect(pB.options).to.deep.equal(options);
      }
    );
  });

  describe(
    EmitterMixinBehavior.describe(),
    EmitterMixinBehavior.test.bind(this, p)
  );
  describe(PubSubBehavior.describe(), PubSubBehavior.test.bind(this, p));

  describe("Can retrieve JSON from a remote endpoint.", () => {
    let fakeModelResponse = { id: 1, name: "Acme House Red", price: "$100.00" },
      reqOpts = {
        method: "GET",
        url: "/api/product/23",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Auth-Token": "xxxxxxxxx"
        }
      };

    before(() => {
      mockRequest.onGet("/api/product/23").reply(200, fakeModelResponse);
      mocks.stub(p, "request").callsFake(function(url, options) {
        options.url = url;
        return net.request(options);
      });
    });

    after(() => {
      p.request.restore();
      mockRequest.reset();
    });

    it("receives JSON back from the API.", () => {
      return p.fetch(reqOpts).then(response => {
        return expect(response.data).to.deep.equal(fakeModelResponse);
      });
    });

    it("Parses a non-empty response and sets instance properties.", () => {
      p.parse(fakeModelResponse);
      let props = Object.keys(p.values);
      expect(props).to.not.be.empty;
      expect(p.values).to.be.an.instanceof(Object);
      expect(props).to.have.length.above(0);
    });

    it("If response is empty, returns an instance of Product.", () => {
      expect(p.parse({})).to.be.an.instanceof(ProductModel);
    });

    describe("Has methods to return the models data.", () => {
      let pojo = null;
      describe("Implements a `serialize` method to return all models attributes as a JSON object.", () => {
        it("Responds to `serialize", () => {
          expect(p).to.respondTo("serialize");
        });

        it("Returns an instance of `Object` with an `id` property that is a `Number`", () => {
          pojo = p.serialize();
          expect(pojo).to.be.an.instanceof(Object);
          expect(Object.getOwnPropertyNames(pojo)).to.have.length.above(0);
          expect(pojo.id).to.be.a("number");
        });

        it("Implements a `toJSON` method to return the models as a JSON string.", () => {
          let json;
          expect(p).to.respondTo("toJSON");
          json = p.toJSON();
          //expect(json).to.be.an.instanceof(String);  //fails
          expect(json).to.be.a("string"); //passes
        });

        xit("Implements a `toMeta` method to return the models as a JSON string.", () => {
          let json;
          expect(p).to.respondTo("toJSON");
          json = p.toJSON();
          //expect(json).to.be.an.instanceof(String);  //fails
          expect(json).to.be.a("string"); //passes
        });
      });
    });
  });
});

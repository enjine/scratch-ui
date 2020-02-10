/*eslint no-unused-expressions: 0*/
import { settings } from "setup";

let expect = settings.assertions.expect;
//let mocks = settings.mocking;

export const EmitterMixinBehavior = {
  describe: function() {
    return "Mixes the Evented behavior.";
  },
  test: function(o) {
    describe("API", () => {
      it("Implements emit().", () => {
        expect(o).to.respondTo("emit");
      });

      it("Implements on().", () => {
        expect(o).to.respondTo("on");
      });

      it("Implements trigger().", () => {
        expect(o).to.respondTo("trigger");
      });

      it("Implements once().", () => {
        expect(o).to.respondTo("once");
      });

      it("Implements delegate().", () => {
        expect(o).to.respondTo("delegate");
      });

      it("Implements delegateOnce().", () => {
        expect(o).to.respondTo("delegateOnce");
      });

      it("Implements listenTo().", () => {
        expect(o).to.respondTo("listenTo");
      });

      it("Implements listenToOnce().", () => {
        expect(o).to.respondTo("listenToOnce");
      });

      it("Implements off().", () => {
        expect(o).to.respondTo("off");
      });

      it("Implements subscribe().", () => {
        expect(o).to.respondTo("subscribe");
      });

      it("Implements unsubscribe().", () => {
        expect(o).to.respondTo("unsubscribe");
      });
    });
  }
};

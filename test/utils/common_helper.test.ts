import { expect } from "chai";
import { convertWinPathToUnix } from "../../src/utils/common_helper";

describe("common_helper", function() {
  describe("convertWinPathToUnix", function () {
    context("with null value", function() {
      it("returns undefined", function () {
        expect(convertWinPathToUnix(null)).to.be.undefined;
      });
    })
  });
})

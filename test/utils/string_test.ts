import { expect } from "chai";
import { convertWinPathToUnix } from "../../src/utils/common_helper";

const http = require("../../src/utils/http");
describe("hashedValues", function () {
  it("doesn't throw unhandled exception with null file name", async function () {
    const val = null;
    const newVal = convertWinPathToUnix(val);
    expect(newVal).to.be.undefined;
  });
});

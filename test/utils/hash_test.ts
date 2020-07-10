import { hashValue } from "../../src/utils/hash";

const expect = require("chai").expect;
const sinon = require("sinon");

describe("Hash Utility", function () {
  context("when the parameter is empty string", function () {
    let string_param = "";

    it("returns empty string", function () {
      expect(hashValue(string_param)).to.equal("");
    });
  });

  context("when the parameter is a string", function () {
    let string_param = "secret_message";

    it("returns a hashed string with 128 character length", function () {
      let result = hashValue(string_param);
      expect(result).to.be.a('string')
        .that.matches(/^[a-f0-9]{128}$/)
        .and.equal('51d9ca721aa09fde72ec722137a3ac8fef053a49df4b2354e36fd95dc3372e881f3a41b9e625d2acb5775f390e98069ee8510296949966b0b8a72a558a42a073');
    });
  });
});

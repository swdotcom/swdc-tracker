import { hashValue } from "../../src/utils/hash";

const expect = require("chai").expect;
const sinon = require("sinon");

describe("Hash Utility", function () {
  context("when the parameter is empty string", async function () {
    let string_param = "";
    it("returns empty string", async function () {
      expect(await hashValue(string_param)).to.equal("");
    });
  });

  context("when the parameter is a string", async function () {
    let string_param = "secret_message";

    it("returns a hashed string with 128 character length", async function () {
      let result = await hashValue(string_param);
      expect(result).to.be.a('string')
        .that.matches(/^[a-f0-9]{128}$/)
        .and.equal('998504e62163ab1030d14ec90ba2d4e4dd87707f2591fcdcb6473e6f6c260778cdaed8b9e913b3965b9ab331553eedcbfb877b3268c3fa414a4cb09a5b30ee05');
    });
  });

});

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

  context("when the sodium library is not initialized", async function () {
    it("calls _sodium.ready", async function () {

    });

    it("GETs the users hashedValues", async function () {

    });

    it("sets the userHashedValues object", async function () {

    });
  });

  context("when the user does not have this hashedValue stored yet", async function () {
    let userHashedValues = {
      "file_name": ["asdfasdfsda", "fasdfsda", "asdfasdfsdew"],
      "project_name": ["bbaljbl", "fjsfiejwil", "faksdjfjsad"]
    };
    let string_param = "secret_message";

    it("POSTs the original and hashedValue to /user_encrypted_data", async function () {

    });

    it("GETs the updated hashedValue list for the user", async function () {
    });
  });

  context("when the user DOES have this hashedValue stored", async function () {
    let userHashedValues = {
      "file_name": ["asdfasdfsda", "fasdfsda", "asdfasdfsdew"],
      "project_name": ["bbaljbl", "fjsfiejwil", "faksdjfjsad"]
    };
    let string_param = "secret_message";

    it("does not POST the original and hashedValue to /user_encrypted_data", async function () {

    });

    it("does not GET the updated hashedValue list for the user", async function () {
    });
  });
});

import { hashValue } from "../../src/utils/hash";
import { expect } from 'chai'

const http = require("../../src/utils/http");
const sinon = require("sinon")

describe("Hash Utility", function () {
  const sandbox = sinon.createSandbox();


  context("when the parameter is empty string", async function () {
    let string_param = "";
    it("returns empty string", async function () {
      expect(await hashValue(string_param, "test-data-type", "test-jwt")).to.equal("");
    });
  });

  context("when the parameter is a string", async function () {
    // the first hashed value in file_name = "alreadyexists"
    let hashedValueThatAlreadyExists = "b6462a82e047f8fd12103ddeace50a4024f88cbcaf01c8705ff6a741408d3df1d70c57e65f80409d1098797b3dd428812443eef566e4dcbab2168734bacdc501"
    let userHashedValues = {
      "file_name": [hashedValueThatAlreadyExists, "fasdfsda", "asdfasdfsdew"],
      "project_name": ["bbaljbl", "fjsfiejwil", "faksdjfjsad"]
    };
    let string_param = "secret_message";
    let expectedHashedValue = '998504e62163ab1030d14ec90ba2d4e4dd87707f2591fcdcb6473e6f6c260778cdaed8b9e913b3965b9ab331553eedcbfb877b3268c3fa414a4cb09a5b30ee05'

    beforeEach(function() {
      // return any api since we're not really trying to call out
      sandbox.stub(http, "get").callsFake(function () {
        return userHashedValues
      });

      sandbox.stub(http, "post").callsFake()
    });

    afterEach(function() {
      sandbox.restore();
    });

    it("returns a hashed string with 128 character length", async function () {
      let result = await hashValue(string_param, "project_name", 'test-jwt');
      expect(result).to.be.a('string')
        .that.matches(/^[a-f0-9]{128}$/)
        .and.equal(expectedHashedValue);
    });

    it("gets the user's hashed values", async function () {
      await hashValue(string_param, "test-data-type", "test-jwt");
      expect(http.get.calledWith("/hashed_values", "test-jwt")).to.eq(true)
    });

    context("when user hashed value does not exist", function() {
      it("encrypts the value", async function() {
        await hashValue(string_param, "test-data-type", "test-jwt");
        expect(http.post.calledWith(
          "/encrypted_user_data",
          {
            value: string_param,
            hashed_value: expectedHashedValue,
            data_type: "test-data-type"
          },
          "test-jwt"
        )).to.eq(true)
      })

      it("gets the hashedValue list for the user", async function() {
        await hashValue(string_param, "test-data-type", "test-jwt");
        expect(http.get.callCount).to.eq(1)
      })
    });

    context("when the user hashed value already exists", function() {
      it("does NOT encrypt the value", async function() {
        await hashValue("alreadyexists", "file_name", "test-jwt");
        expect(http.post.callCount).to.eq(0)
      });

      it("does NOT GET the hashedValue list for the user", async function() {
        await hashValue("alreadyexists", "file_name", "test-jwt");
        expect(http.get.callCount).to.eq(0)
      })

      it("returns a hashed string with 128 character length", async function () {
        const result = await hashValue("alreadyexists", "file_name", "test-jwt");
        expect(result).to.be.a('string')
          .that.matches(/^[a-f0-9]{128}$/)
          .and.equal(hashedValueThatAlreadyExists);
      });
    })
  });
});

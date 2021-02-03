import {
  hashAndEncryptValues,
  hasHashValueInCache,
  hashValue
} from "../../src/utils/hash";
import { expect } from 'chai'

const http = require("../../src/utils/http");
const sinon = require("sinon")

describe("hash util", function () {
  describe("hashAndEncryptValues", function() {
    const sandbox = sinon.createSandbox();

    beforeEach(function () {
      sandbox.stub(http, "get").callsFake(function () {
        return { data: {} }
      });

      sandbox.stub(http, "post").callsFake(function () {
        return { status: 201 }
      });
    });

    afterEach(function () {
      sandbox.restore();
    });

    it("returns the expected map of values", async function() {
      const payload = [
        { value: "/Users/bob/test_app/", dataType: "file_path" },
        { value: "/Users/bob/test_app/path.js", dataType: "file_name" },
        { value: "", dataType: "empty_string" },
        { value: null, dataType: "null_value" }
      ]

      const result = await hashAndEncryptValues(payload, 'jwt-token');
      expect(result.file_path).to.eql("e318cb72390f272c992c878c8f3e712b6dbbd5cf3b94b304eb7529f466c8bcded0312445c0af17ee5f7e48b816b9fe1c43fd7e10a46e7c35272a56bd33ddc149")
      expect(result.file_name).to.eql("4a3bede4a465f6d4e95019a6a6c90fbf972e96b4c10eef3f08a576f22e83f69f7876946f1fb0effdab730ec4d6cd10cd71ba8da195e4e3967e4d25ee8df39576")
      expect(result.null_value).to.eql(null)
      expect(result.empty_string).to.eql("")
    });
  });

  describe("hashValue", function() {
    it("returns the hashed value", async function() {
      const result = await hashValue("/Users/bob/test_app/path.js");
      expect(result).to.eql("4a3bede4a465f6d4e95019a6a6c90fbf972e96b4c10eef3f08a576f22e83f69f7876946f1fb0effdab730ec4d6cd10cd71ba8da195e4e3967e4d25ee8df39576")
    });
  });

  describe("hasHashValueInCache", function() {
    it("returns false if the hash value does not exist", async function() {
      const result = await hasHashValueInCache("file_path", "12345");
      expect(result).to.eq(false);
    });

    it("adds the value if it does not exist", async function() {
      await hasHashValueInCache("foobar", "54321");
      const result = await hasHashValueInCache("foobar", "54321");
      expect(result).to.eq(true);
    });
  });
});


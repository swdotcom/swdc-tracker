import { expect } from 'chai';
const fs = require("fs");
import { getSoftwareHashedValuesFile, getStoredHashedValues, storeHashedValues } from '../../src/utils/file';

describe("file util", function () {
  beforeEach(function () {
    deleteHashedFile();
  });

  afterEach(function () {
    deleteHashedFile();
  });

  context("when no file exists", function() {
    it("returns an empty hash", async function() {
      const hashedVals = getStoredHashedValues();
      expect(Object.keys(hashedVals).length).to.eq(0);
    });

    it("returns an hash with a file value", async function() {
      storeHashedValues({'file1': 'value1'});
      const hashedVals = getStoredHashedValues();

      expect(hashedVals['file1']).to.eq('value1');
    });
  });
});

function deleteHashedFile() {
  try {
    fs.unlinkSync(getSoftwareHashedValuesFile())
    console.log("Successfully deleted the file.")
  } catch(err: any) {
    throw err
  }
}

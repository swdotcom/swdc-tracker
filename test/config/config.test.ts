import { getPackageInfoFromFile } from "../../src/utils/env_helper";

const expect = require("chai").expect;

describe("configTests", function () {

	context("validate package environment", function () {
		it("verify version from package file", function () {
			const { name, version } = getPackageInfoFromFile();
			const versionParts = version.split(".");
			expect(parseInt(versionParts[2], 10)).to.be.gt(0);
		});
	});

});
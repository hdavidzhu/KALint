var chai = require('chai');
var sinonChai = require("sinon-chai");
var esprima = require('esprima');

var expect = chai.expect;
chai.use(sinonChai);

var KALint = require('../src/ka_lint').KALint;
var testRes = require('./test_code_and_conditions');

describe("KALint", function() {
  describe(".lint", function() {
    it("outputs no errors for accurate whitelist conditions", function() {
      var esTree = esprima.parse(testRes.whitelistCode_1);
      var errors = KALint.lint(esTree, testRes.whiteListCond_1);
      expect(errors.length).to.equal(0);
    });

    it("outputs no errors for accurate blacklist conditions", function() {
      var esTree = esprima.parse(testRes.blacklistCode_1);
      var errors = KALint.lint(esTree, testRes.blacklistCond_1);
      expect(errors.length).to.equal(0);
    });

    it.only("outputs no errors for accurate nested conditions", function() {
      var esTree = esprima.parse(testRes.roughStructureCode_1);
      var errors = KALint.lint(esTree, testRes.roughStructureCond_1);
      expect(errors.length).to.equal(0);
    });
  });

  describe(".searchForConditionInTree", function() {
  });

  describe(".diffCountWithCondition", function() {

  });
});

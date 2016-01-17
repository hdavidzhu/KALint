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
      KALint.lint(esTree, testRes.whiteListCond_1, function(error) {
        console.log(error);
      });
    });

    it("outputs no errors for accurate blacklist conditions", function() {

    });

    it("outputs no errors for accurate nested conditions", function() {

    });
  });

  describe(".searchForConditionInTree", function() {
  });

  describe(".diffCountWithCondition", function() {

  });
});

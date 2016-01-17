var esprima = require('esprima');
var KALint = require('./ka_lint').KALint;

var esTree = esprima.parse("var answer = 42");
KALint.lint(esTree, [
  {
    type: "VariableDeclaration",
    exactly: 1
  }
], function(error) {
  console.log(error);
});

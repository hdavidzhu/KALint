var esprima = require('esprima');
var KALinter = require('./ka_linter').KALinter;

var esTree = esprima.parse("var answer = 42");
KALinter.lint(esTree, [
  {
    type: "VariableDeclaration",
    exactly: 1
  }
], function(error) {
  console.log(error);
});

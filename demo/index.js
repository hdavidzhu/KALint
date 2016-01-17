var myCodeMirror = CodeMirror(document.getElementById("code-block"), {
  value: "var x = 4;",
  mode: "javascript",
  lineNumbers: true
});

function logCode() {
  var code  = myCodeMirror.getValue();
  var esprimadCode = esprima.parse(code, {
    // TODO: Enter options here.
  });

  KALint.lint(esprimadCode, [
    {
      type: "VariableDeclaration",
      exactly: 1
    }
  ], function(error) {
    console.log(error);
  });
}

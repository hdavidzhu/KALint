var myCodeMirror = CodeMirror(document.getElementById("code-block"), {
  mode: "javascript",
  lineNumbers: true
});

function logCode() {
  var code  = myCodeMirror.getValue();
  var esprimadCode = esprima.parse(code, {
    // TODO: Enter options here.
  });
}

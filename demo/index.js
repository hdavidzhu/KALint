var myCodeMirror = CodeMirror(document.getElementById("code-block"), {
  value: "var x = 4;",
  mode: "javascript",
  lineNumbers: true
});

function lint() {
  document.getElementById("errors").innerText = "";

  var code  = myCodeMirror.getValue();

  try {
    var esprimadCode = esprima.parse(code, { tolerant: true });
    var errors = esprimadCode.errors;
    $("#errors").append(errors.length);

    KALint.lint(esprimadCode, myExport.whiteListCond_1, function(error) {
      // This callback gets called whenever an error is detected in runtime.
      $("#errors").append(error.error);
    });
  } catch(e) {
    $("#errors").append(e.toString());
  }
}

// From: https://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

var debouncedLogCode = debounce(logCode, 250);

logCode();
$("#code-block").on("input", debouncedLogCode);

var $errors = $("#errors");

var myCodeMirror = CodeMirror(document.getElementById("code-block"), {
  value: "var x = 4;",
  mode: "javascript",
  lineNumbers: true
});

function lint() {
  // First, clear the error box.
  $errors.empty();

  // Then, grab our code text.
  var code  = myCodeMirror.getValue();

  try {
    // Convert code and detect errors.
    var esprimadCode = esprima.parse(code, { tolerant: true });
    var errors = esprimadCode.errors;
    $errors.append(errors.length);

    // Lint the code and emit any errors.
    KALint.lint(esprimadCode, myExport.whiteListCond_1, function(error) {
      // This callback gets called whenever an error is detected in runtime.
      $errors.append(error.error);
    });
  } catch(e) {
    $errors.append(e.toString());
  }
}

// From: https://davidwalsh.name/javascript-debounce-function
// Prevents the linter from constantly running.
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

// Run.
logCode();
var debouncedLogCode = debounce(logCode, 250);
$("#code-block").on("input", debouncedLogCode);

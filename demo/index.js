var $errors = $("#errors");

var myCodeMirror = CodeMirror(document.getElementById("code-block"), {
  value: myExport.whitelistCode_1,
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

    // Lint the code and emit any errors.
    KALint.lint(esprimadCode, myExport.roughStructureCond_2, function(error) {
      // This callback gets called whenever an error is detected in runtime.
      $errors.append(error.message + "<br>");
    });
  } catch(e) {
    $errors.append(e.toString() + "<br>");
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
lint();
var debouncedLint = debounce(lint, 250);
$("#code-block").on("keydown", debouncedLint);

# KALint
Simple linter API for Javascript online.

### Usage

KALint can be used both in the browser and with Node. Here's how you can lint:

```
var KALint = require('src/kalint.js').KALint;
var esprima = require('esprima');

var code = "var x = 4;"
var conditions = [
  {
    type: "ForStatement",
    exactly: 1, // Exact requirements.

    // You can nest more conditions for more specific scoping.
    conditions: {
        type: "VariableDeclaration",
        greaterThan: 3
      }
  },

  {
    type: "IfStatement",
    greaterThan: 2 // Whitelisting with minimum requirement.
  },

  {
    type: "WhileStatement",
    lessThan: 1 // Blacklisting.
  }
]

// Parse code.
var esTree = esprima.parse(code);

// Get errors.
var errors = KALint.lint(esTree, conditions);

// You can also add a error catcher that collects errors at runtime.
var errors2 = KALint.lint(esTree, conditions, function(error) {
  console.log(error.message);
});
```

This is the error format:

```

error = {
  message: "Expected 5, got 3",
  type: "IfStatement"
  expectation: "greaterThan",
  expectedCount: 5,
  actualCount: 3
}

```

### Demo

To run the demo, you can use Python's SimpleHTTPServer or Node's http-server to start a server in this root directory. Visit `(localhost_and_portname)/demo` to see this in action. 

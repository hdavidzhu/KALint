(function(exports) {
  'use strict';

  exports.KALint = {};

  exports.KALint.errorsBuffer = [];
  exports.KALint.onError = function(error) {};

  // NOTE: Using the ESTree format. Learn more at https://github.com/estree/estree
  // `conditions` is an array of JS objects following a similar ESTree format
  // with additional flags.
  // Returns: Array of errors if any are present.
  exports.KALint.lint = function(esTree, conditions, onErrorCallback) {
    exports.KALint.onError = onErrorCallback ? onErrorCallback : exports.KALint.onError; // Overwrite the error emitter.
    exports.KALint.errorsBuffer = []; // Clear existing errors.
    exports.KALint.growErrorsBuffer(esTree, conditions); // Recursively search through tree and emit errors.
    return exports.KALint.errorsBuffer;
  };

  exports.KALint.growErrorsBuffer = function(node, _conditions) {
    // Constrain input to handle arrays.
    var conditions = exports.KALint.toArray(_conditions);

    // Loop through conditions and recursively search for errors in that esTree scope.
    for (var condIndex = 0; condIndex < conditions.length; condIndex++) {
      var chosenCondition = conditions[condIndex];
      var validCount = exports.KALint.searchForConditionInTree(node, chosenCondition);
      var error = exports.KALint.emitErrors(validCount, chosenCondition); // Error is calculated by another method.

      // Errors are emitted and also collected, depending on how you want to access them.
      if (error) {
        exports.KALint.errorsBuffer.push(error);
      }
    }
  };

  // Given a single condition, recursively go through tree and count instances.
  exports.KALint.searchForConditionInTree = function(node, condition, _validCount) {
    var treeBody = node.body;
    var validCount = _validCount ? _validCount : 0;

    // Return our count when no more children are detected.
    if (!treeBody) {
      return validCount;
    }

    treeBody = exports.KALint.toArray(treeBody);

    // Loop through all the body elements.
    for (var nodeIndex = 0; nodeIndex < treeBody.length; nodeIndex++) {

      // Locate the current node.
      var chosenNode = treeBody[nodeIndex];

      if(chosenNode.type === condition.type) {
        validCount += 1; // If the node type match, add to the counter.

        // Also, recursively check for other errors within the nested scope
        // of our currently chosen condition.
        if (condition.conditions) {
          exports.KALint.growErrorsBuffer(chosenNode, condition.conditions);
        }
      }

      // Depth-first-search the node's children for our required conditions.
      // Update our count from the subtrees.
      validCount = exports.KALint.searchForConditionInTree(chosenNode, condition, validCount);
    }

    return validCount;
  };

  exports.KALint.emitErrors = function(validCount, condition) {
    var conditionCount = condition.exactly || condition.lessThan || condition.greaterThan;
    var difference = validCount - conditionCount;
    var error;

    if (condition.exactly !== undefined && difference !== 0) {
      error = {
        message: condition.type + ": Expected " + conditionCount + " but detected " + validCount + ".",
        type: condition.type,
        expectation: "exact",
        expectedCount: conditionCount,
        actualCount: validCount
      };

    } else if (condition.lessThan !== undefined && difference >= 0) {
      error = {
        message: condition.type + ": Expected at most " + (conditionCount - 1) + " but detected " + validCount + ".",
        type: condition.type,
        expectation: "lessThan",
        expectedCount: conditionCount,
        actualCount: validCount
      };

    } else if (condition.greaterThan !== undefined && difference <= 0) {
      error = {
        message: condition.type + ": Expected at least " + (conditionCount + 1) + " but detected " + validCount + ".",
        type: condition.type,
        expectation: "greaterThan",
        expectedCount: conditionCount,
        actualCount: validCount
      };
    }

    if (error) {
      exports.KALint.onError(error);
      return error;
    }
  };

  exports.KALint.toArray = function(input) {
    return input.constructor == Array ? input : [input];
  };
})(typeof exports === 'undefined'? window : exports);

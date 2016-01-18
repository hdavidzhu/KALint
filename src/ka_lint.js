(function(exports) {
  exports.KALint = {
    // NOTE: Using the ESTree format. Learn more at https://github.com/estree/estree
    // `conditions` is an array of JS objects following a similar ESTree format
    // with additional flags.
    // Returns: Array of errors if any are present.
    // TODO: Document those flags.
    lint: function(esTree, conditions, onErrorCallback) {
      var errors = [];

      for (var condIndex = 0; condIndex < conditions.length; condIndex++) {
        var chosenCondition = conditions[condIndex];

        var validCount = this.searchForConditionInTree(esTree, chosenCondition);
        var error = this.emitErrors(validCount, chosenCondition, onErrorCallback);

        if (error) {
          errors.push(error);
        }
      }

      return errors;
    },

    searchForConditionInTree: function(node, condition, validCount) {
      var treeBody = node.body;
      if (!treeBody) {
        return validCount;
      }

      if (validCount === undefined) {
        var validCount = 0;
      }

      // Loop through all the body elements.
      for (var nodeIndex = 0; nodeIndex < treeBody.length; nodeIndex++) {

        // Locate the current node.
        var node = treeBody[nodeIndex];

        // If the node type match, add to the counter.
        if(node.type === condition.type) {
          validCount += 1;
        }

        // DFS the node's children for our required conditions.
        validCount = this.searchForConditionInTree(node, validCount);
      }

      return validCount;
    },

    emitErrors: function(validCount, condition, callback) {
      var conditionCount = condition.exactly || condition.lessThan || condition.greaterThan;
      var difference = validCount - conditionCount;
      var error;

      // TODO: Refactor to be cleaner.
      if (condition.exactly !== undefined && difference != 0) {
        error = {
          error: condition.type + ": Expected " + conditionCount + " but detected " + validCount + ".",
          type: condition.type,
          expectation: "exact",
          expectedCount: conditionCount,
          actualCount: validCount
        }
      } else if (condition.lessThan !== undefined && difference >= 0) {
        error = {
          error: condition.type + ": Expected at most " + (conditionCount - 1) + " but detected " + validCount + ".",
          type: condition.type,
          expectation: "lessThan",
          expectedCount: conditionCount,
          actualCount: validCount
        }
      } else if (condition.greaterThan !== undefined && difference <= 0) {
        error = {
          error: condition.type + ": Expected at least " + (conditionCount + 1) + " but detected " + validCount + ".",
          type: condition.type,
          expectation: "greaterThan",
          expectedCount: conditionCount,
          actualCount: validCount
        }
      }

      if (error) {
        callback(error);
        return error;
      }
    }
  };
})(typeof exports === 'undefined'? window : exports);

(function(exports) {
  exports.KALint = {
    // NOTE: Using the ESTree format. Learn more at https://github.com/estree/estree
    // `conditions` is an array of JS objects following a similar ESTree format
    // with additional flags.
    // Returns: Array of errors if any are present.
    // TODO: Document those flags.
    lint: function(esTree, conditions, onErrorCallback) {
      this.onError = onErrorCallback ? onErrorCallback : this.onError; // Overwrite the error emitter.
      this.errorsBuffer = []; // Clear existing errors.
      this.growErrorsBuffer(esTree, conditions);
      return this.errorsBuffer;
    },

    errorsBuffer: [],
    onError: function(error) {},

    growErrorsBuffer: function(node, _conditions) {
      // Constrain input to handle arrays.
      var conditions = _conditions;
      if (conditions.constructor !== Array) {
        conditions = [conditions];
      }

      for (var condIndex = 0; condIndex < conditions.length; condIndex++) {
        var chosenCondition = conditions[condIndex];
        var validCount = this.searchForConditionInTree(node, chosenCondition);
        var error = this.emitErrors(validCount, chosenCondition);

        if (error) {
          this.errorsBuffer.push(error);
        }
      }
    },

    searchForConditionInTree: function(node, condition, _validCount) {
      var treeBody = node.body;
      var validCount = _validCount ? _validCount : 0;

      if (!treeBody) {
        return validCount;
      }

      // Loop through all the body elements.
      for (var nodeIndex = 0; nodeIndex < treeBody.length; nodeIndex++) {

        // Locate the current node.
        var chosenNode = treeBody[nodeIndex];

        if(chosenNode.type === condition.type) {
          validCount += 1; // If the node type match, add to the counter.

          // Also, recursively check for other errors within the nested scope
          // of our currently chosen condition.
          if (condition.conditions) {
            this.growErrorsBuffer(node, condition.conditions);
          }
        }

        // DFS the node's children for our required conditions.
        validCount = this.searchForConditionInTree(chosenNode, condition, validCount);
      }

      return validCount;
    },

    emitErrors: function(validCount, condition) {
      var conditionCount = condition.exactly || condition.lessThan || condition.greaterThan;
      var difference = validCount - conditionCount;
      var error;

      // TODO: Refactor to be cleaner.
      if (condition.exactly !== undefined && difference !== 0) {
        error = {
          error: condition.type + ": Expected " + conditionCount + " but detected " + validCount + ".",
          type: condition.type,
          expectation: "exact",
          expectedCount: conditionCount,
          actualCount: validCount
        };
      } else if (condition.lessThan !== undefined && difference >= 0) {
        error = {
          error: condition.type + ": Expected at most " + (conditionCount - 1) + " but detected " + validCount + ".",
          type: condition.type,
          expectation: "lessThan",
          expectedCount: conditionCount,
          actualCount: validCount
        };
      } else if (condition.greaterThan !== undefined && difference <= 0) {
        error = {
          error: condition.type + ": Expected at least " + (conditionCount + 1) + " but detected " + validCount + ".",
          type: condition.type,
          expectation: "greaterThan",
          expectedCount: conditionCount,
          actualCount: validCount
        };
      }

      if (error) {
        this.onError(error);
        return error;
      }
    }
  };
})(typeof exports === 'undefined'? window : exports);

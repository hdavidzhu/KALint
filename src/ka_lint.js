(function(exports) {
  exports.KALint = {
    // NOTE: Using the ESTree format. Learn more at https://github.com/estree/estree
    // `conditions` is an array of JS objects following a similar ESTree format
    // with additional flags.
    // Returns: Array of errors if any are present.
    // TODO: Document those flags.
    lint: function(esTree, conditions, onErrorCallback) {
      for (var condIndex = 0; condIndex < conditions.length; condIndex++) {
        var chosenCondition = conditions[condIndex];

        // TODO: Maybe just pass in ESTree?
        var validCount = this.searchForConditionInTree(esTree.body, chosenCondition);
        var difference = this.diffCountWithCondition(validCount, chosenCondition);
      }

      onErrorCallback(difference);
    },

    searchForConditionInTree: function(chosenBody, condition, validCount) {
      if (validCount === undefined) {
        var validCount = 0;
      }

      // Loop through all the body elements.
      for (var nodeIndex = 0; nodeIndex < chosenBody.length; nodeIndex++) {

        // Locate the current node.
        var node = chosenBody[nodeIndex];

        // If the node type match, add to the counter.
        if(node.type === condition.type) {
          validCount += 1;
        }

        // DFS the node's children for our required conditions.
        if (node.body && node.body.length > 0) {
          validCount = searchForConditionInTree(node.body, validCount);
        }
      }

      return validCount;
    },

    diffCountWithCondition: function(validCount, condition) {
      var conditionCount = condition.exactly || condition.lessThan || condition.greaterThan;
      return validCount - conditionCount;
    }
  };
})(typeof exports === 'undefined'? window : exports);

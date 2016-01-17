(function(exports) {

  exports.KALinter = {
    // NOTE: Using the ESTree format. Learn more at https://github.com/estree/estree
    // `conditions` is an array of JS objects following a similar ESTree format
    // with additional flags.
    // Returns: Array of errors if any are present.
    // TODO: Document those flags.
    lint: function(esTree, conditions, onErrorCallback) {
      for (var condIndex; condIndex < conditions.length; condIndex++) {
        var chosenCondition = conditions[condIndex];

        // TODO: Maybe just pass in ESTree?
        var validCount = searchForConditionInTree(esTree.body, chosenCondition);
        var difference = diffCountWithCondition(validCount, condition);
      }

      return count;
    }
  };

  function searchForConditionInTree(chosenBody, condition, validCount) {
    if (validCount === undefined) {
      var validCount = 0;
    }

    // Loop through all the body elements.
    for (var nodeIndex = 0; nodeIndex < currentBody.length; nodeIndex++) {

      // Locate the current node.
      var node = currentBody[nodeIndex];

      // If the node type match, add to the counter.
      if(node.type === condition.type) {
        validCount += 1;
      }

      // DFS the node's children for our required conditions.
      if (node.body.length > 0) {
        validCount = searchForConditionInTree(node.body, validCount);
      }
    }

    return validCount;
  }

})(typeof exports === 'undefined'? this['mymodule']={}: exports);

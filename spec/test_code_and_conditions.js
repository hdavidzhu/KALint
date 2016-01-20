(function(exports) {
  exports.exampleLint = {

    whitelistCode_1: "for (var x=0; x<9; x++) {}\n var y;",
    whitelistCode_2: "var y; \n for (var x=0; x<9; x++) {}",
    whitelistCode_3: "for (var x=0; x<9; x++) {}",

    whiteListCond_1: [
      {
        "type": "ForStatement",
        "greaterThan": 0
      },
      {
        "type": "VariableDeclaration",
        "greaterThan": 0
      },
    ],

    whiteListCond_2: [
      {
        "type": "ForStatement",
        "greaterThan": 0
      },
      {
        "type": "WhileStatement",
        "greaterThan": 0
      },
    ],

    blacklistCode_1: "x++;",
    blacklistCode_2: "for (var x=0; x<9; x++) {}",
    blacklistCode_3: "var x;",

    blacklistCond_1: [
      {
        "type": "ForStatement",
        "lessThan": 0
      },
      {
        "type": "VariableDeclaration",
        "lessThan": 0
      },
    ],

    roughStructureCode_1: "for (var x=0; x<9; x++) { \n var y; \n } ",

    roughStructureCond_1: {
      "type": "ForStatement",
      "greaterThan": 0,
      "conditions": {
        "type": "IfStatement",
        "greaterThan": 0
      }
    },

    roughStructureCond_2: {
      "type": "ForStatement",
      "greaterThan": 0,
      "conditions": [
        {
          "type": "IfStatement",
          "greaterThan": 0
        },
        {
          "type": "ForStatement",
          "lessThan": 1
        }
      ]
    }
  };
})(typeof exports === 'undefined'? window : exports);

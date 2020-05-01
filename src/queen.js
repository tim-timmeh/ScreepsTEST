'use strict'
require('Op.Base');
var myFunc = require('myFunctions');

const operationTypes = {
  55:OperationBase, // Green, Green
}
// Functions for setting up Object heirachy
module.exports = {

  initKing : function () {
    let king = new King()
    king.init()
    return king
  },

  getOperations : function (king) {
    let operationList
    for (let flagName in Game.flags) { // iterate over all flags / designated operations
      let flagType = `${Game.flags[flagName].color}${Game.flags[flagName].secondaryColor}`; // convert color to code
      if (flagType == '1010') continue; // white flags do nothing
      for (let opCode in operationTypes) { // iterate over operationType codes
        if (opCode == flagType) {
          let operationType = operationTypes[opCode];
          let flag = Game.flags[flagName];
          let operation;
          // First one will not change anything if failed, second one will return/change variable to undefined
          myFunc.tryWrap(() => { // try/catch wrapper function
            operation = new operationType(flag, flagName, opCode, king) // what to try
          },'Error generating operation from flag') // custom error message before stack error message
          //operation = myFunc.tryWrap(()=> new operationType(flag, flagName, opCode, king),'Error generating operation from flag')
          operationList[flagName] = operation;
          //global[flagName] = operation; //Need to check what this is for, do i need it?
        } else {
          console.log('Error in Operation / flag matchup - ' + opCode + flagType)
        }
      }
    };
    return _.sortBy(operationList, (op) => op.priority);
  },
};

'use strict'
require('op.Base');

const operationTypes = {
  55:operationBase, // Green, Green
}
// Functions for setting up Object heirachy
module.exports = {

  initKing : function () {
    let king = new king()
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
          try {
            operation = new operationType(flag, flagName, opCode, king); // flag = obj, flagName = strign, opCode = objkey, king = object.
          }
          catch (e) {
            console.log("Error generating operation from flag");
            console.log(e);
          }

          operationList[flagName] = operation;

          //global[flagName] = operation; //Need to check what this is for, do i need it?
        } else {
          console.log('Error in Operation / flag matchup - ' + opCode + flagType)
        }
      }
    }
  },
};

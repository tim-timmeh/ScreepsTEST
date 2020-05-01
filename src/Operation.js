'use strict'

/*
flag - missions will operate relative to this flag, use colors to determine flag type via opCode
flaName - flag.name should be default set flag1/2/3 etc maybe need to add additional incase of doubleup?
pCode - color code of flag (eg 55 = green green) used to determine which operation to instantiate
empire - object used for king-scoped behavior (terminal transmission, etc.)
*/

function Operation(flag, flagName, opCode, king) {
  this.flag = flag;
  this.name = flagName
  this.type = opCode
  this.king = king
  this.memory = flag.memory
  //if (this.flag.room) {
    //this.hasVision = true; // is there vision in the room
    //this.sources = this.flag.room.sources //get sources via room prototype (via variable/memory)
    //*this.minerals need to create
  }
}

Operation.prototype.init = function () { // Initialize / build objects required

};
Operation.prototype.rolecall = function () { // perform rolecall on required creeps spawn if needed

};
Operation.prototype.action = function () { // perform actions / missions

};
Operation.prototype.finalize = function () { // finalize?

};

// Additional methods/functions below

'use strict'
require ('Operation');
require ('config');
require ('Miss.Butler')
const {PRIORITY} = require('config');
//CONSTRUCTOR
function OperationBase(flag, flagName, opCode, king) {
  Operation.call(this, flag, flagName, opCode, king); // uses params to pass object through operation constructor first
  this.priority = PRIORITY.CORE;
}

OperationBase.prototype = Object.create(Operation.prototype); // makes operationbase protos copy of operation protos
OperationBase.prototype.constructor = OperationBase; // reset constructor to operationbase, or else constructor is operation

OperationBase.prototype.initOp = function () { // Initialize / build objects required
  //set SpawnGroup
  this.spawnGroup = this.king.getSpawnGroup(this.flag.room)
  //butler missions
  this.addMission(new MissionButler(this)))
  //defence missions
  //mining missions
  //building missions
  //upgrader missions
  //
};
OperationBase.prototype.rolecall = function () { // perform rolecall on required creeps spawn if needed

};
OperationBase.prototype.action = function () { // perform actions / missions

};
OperationBase.prototype.finalize = function () { // finalize?

};

// Additional methods/functions below

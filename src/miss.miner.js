'use strict'
require('mission');

function MissionMiner(operation, name, source) { // constructor, how to build the object
  Mission.call(operation,name)
  this.source = source
}

MissionMiner.prototype = Object.create(Mission.prototype); // makes operationbase protos copy of operation protos
MissionMiner.prototype.constructor = MissionMiner; // reset constructor to operationbase, or else constructor is operation

MissionMiner.prototype.init = function () { // Initialize / build objects required
  this.distanceToSpawn = this.findDistanceToSpawn(this.source.pos)
  this.storage = this.findStorage(this.source.pos)//find storage for room,
  this.container = this.findMinerContainer(this.source)
};

MissionMiner.prototype.rolecall = function () { // perform rolecall on required creeps spawn if needed
  this.miners = this.creepRoleCall('miner', this.getBody({work:5, carry:1, move:3},{maxRatio: 1}));
};

MissionMiner.prototype.action = function () { // perform actions / missions

};
MissionMiner.prototype.finalize = function () { // finalize?

};

// Additional methods/functions below
MissionMiner.prototype.findMinerContainer = function (source) {
  let container = source.pos.findInRange(LOOK_STRUCTURES,1);
  if (container) return container;
}

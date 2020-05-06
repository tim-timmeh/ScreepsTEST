'use strict'
require('mission');

function MissionDefence(operation) { // constructor, how to build the object
  Mission.call(operation,'Mission Defence')
}

MissionDefence.prototype = Object.create(Mission.prototype); // makes operationbase protos copy of operation protos
MissionDefence.prototype.constructor = MissionDefence; // reset constructor to operationbase, or else constructor is operation

MissionDefence.prototype.init = function () { // Initialize / build objects required

};

MissionDefence.prototype.rolecall = function () { // perform rolecall on required creeps spawn if needed
  this.defenders = this.creepRoleCall('defender', ,)
};

MissionDefence.prototype.action = function () { // perform actions / missions

};
MissionDefence.prototype.finalize = function () { // finalize?

};

// Additional methods/functions below

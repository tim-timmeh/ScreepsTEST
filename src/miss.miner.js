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
  this.storage = this.findStorage(this.source.pos)//find closest storage for room,
  this.container = this.source.findStructureNearby(STRUCTURE_CONTAINER, 1) // find container
  if (!this.container){
    this.placeMinerContainer()
  }
};

MissionMiner.prototype.rolecall = function () { // perform rolecall on required creeps spawn if needed
  this.miners = this.creepRoleCall('miner', this.getBody({work:5, carry:1, move:3},{maxRatio: 1}));
};

MissionMiner.prototype.action = function () { // perform actions / missions

};
MissionMiner.prototype.finalize = function () { // finalize?

};

// Additional methods/functions below
/*MissionMiner.prototype.findMinerContainer = function (source) {
let container = source.pos.findInRange(LOOK_STRUCTURES,1);
if (container) return container;
}*/

MissionMiner.prototype.placeMinerContainer = function () {
  //if (this.room.controller && this.room.controller.my && this.room.controller.level == 1) return; // why not create container at level 1?
  let startingObject = this.storage
  if (!startingObject) {
    startingObject = this.room.find(FIND_MY_SPAWNS)[0];
    if (!startingObject) return
  }
  if (this.source.pos.findInRange(FIND_CONSTRUCTION_SITES,1).length > 0) return;// NEEDS WORK use mem? like findStructureNearby proto?
  let ret = PathFinder.search(
    this.source.pos, [{pos: startingObject.pos, range: 1}], { // ?Might need to do -  [{pos: this.source.pos, range:1}]
      swampCost: 2,
      plainCost: 2,
      roomCallback: function(roomName) {
        let room = Game.rooms[roomName];
        if (!room) return;
        let costs = new PathFinder.CostMatrix;
        room.find(FIND_STRUCTURES).forEach(function(struct) {
          if (struct.structureType == STRUCTURE_ROAD) {
            costs.set(struct.pos.x, struct.pos.y, 1);
          } else if (struct.structureType != STRUCTURE_CONTAINER && (struct.structureType != STRUCTURE_RAMPART || !struct.my)) {
            costs.set(struct.pos.x, struct.pos.y, 0xff);
          }
        });
        return costs;
      },
    }
  );
  if (ret.incomplete || ret.path.length == 0) {
    console.log(`Pathing for miner container placement failed - ${this.opName} - ${this.room} - ${this.name}`);
  }
  let position = ret.path[0];
  console.log(`Miner: Placing container in ${this.room} - ${this.opName} - ${this.name}`);
  position.createConstructionSite(STRUCTURE_CONTAINER);
}

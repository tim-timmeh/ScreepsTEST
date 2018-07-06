"use strict"
/*
 for range miners - container underneath? mine : construction underneath ? energy at 50 ? continue construction : mine : build container;
*/
var roleMiner = {

  run: function (creep) {
    var source = Game.getObjectById(creep.memory.minerSource)
    var structures = [];
	if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
      if (creep.moveByPath(creep.memory.pathing) < 0 || !source.pos.isEqualTo(creep.memory.pathing[creep.memory.pathing.length - 1])){
        creep.memory.pathing = creep.pos.findPathTo(source,{ignoreCreeps : true});
      }
    //creep.moveTo(source, {visualizePathStyle: {stroke: '#fa0'}});
    } else if ((structures = creep.pos.lookFor(LOOK_STRUCTURES)) != undefined && structures.length < 1) {
      var construction = creep.pos.lookFor(LOOK_CONSTRUCTION_SITES)
      if (construction.length < 1) {
        creep.pos.createConstructionSite(STRUCTURE_CONTAINER);
      } else if (_.sum(creep.carry) == creep.carryCapacity) {
        creep.build(construction[0])
      }
    } else if (Memory.containers == undefined){
        Memory.containers = [];
    } else if (structures != undefined && Memory.containers.indexOf(structures[0].id) == -1) {
        Memory.containers.push(structures[0].id)
    }
    }
}
module.exports = roleMiner;

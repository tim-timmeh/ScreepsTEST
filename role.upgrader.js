"use strict"
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say("\u26CF harvest");
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say("\uD83D\uDC8E Upgrade");
        }

        if (!creep.memory.building) {
            var sources = creep.pos.findClosestByPath(FIND_SOURCES);
            var targetsS = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (s) => {
                    return (s.structureType == STRUCTURE_STORAGE);
                }
            });
            if (targetsS != "" && creep.room.storage.store[RESOURCE_ENERGY] > 0){
              if(creep.withdraw(targetsS[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                if (creep.moveByPath(creep.memory.pathing) < 0 || !targetsS[0].pos.isEqualTo(creep.memory.pathing[creep.memory.pathing.length - 1])){
                  creep.memory.pathing = creep.pos.findPathTo(targetsS[0],{ignoreCreeps : true});
                }
              //creep.moveTo(targetsS[0], {visualizePathStyle: {stroke: "#fff"}});
              }  // **Change to find closest energy
            } else if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
              if (creep.moveByPath(creep.memory.pathing) < 0 || !sources.pos.isEqualTo(creep.memory.pathing[creep.memory.pathing.length - 1])){
                creep.memory.pathing = creep.pos.findPathTo(sources,{ignoreCreeps : true});
              }
                //creep.moveTo(sources, {visualizePathStyle: {stroke: '#fa0'}});
            }
        } else {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
              //if (creep.moveByPath(creep.memory.pathing) < 0 || !creep.room.controller.pos.isEqualTo(creep.memory.pathing[creep.memory.pathing.length - 1])){
              //  creep.memory.pathing = creep.pos.findPathTo(creep.room.controller,{ignoreCreeps : true});
              //}
              creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: "#fff"}});
            }
        }
	}
};

module.exports = roleUpgrader;

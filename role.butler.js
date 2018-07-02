"use strict"
var roleUpgrader = require("role.upgrader");
var roleButler = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say("Hmm");
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say("Urg");
        }

        if(!creep.memory.building) {
          // **Change to find closest energy
          var sources = creep.pos.findClosestByPath(FIND_SOURCES);
          var targetsS = creep.room.find(FIND_MY_STRUCTURES, {
              filter: (s) => {
                  return (s.structureType == STRUCTURE_STORAGE);
              }
          });
          if (targetsS && creep.room.storage.store[RESOURCE_ENERGY] > 0){
            if(creep.withdraw(targetsS[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targetsS[0], {visualizePathStyle: {stroke: "#fff"}});
            }  // **Change to find closest energy
          } else if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources, {visualizePathStyle: {stroke: '#fa0'}});
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
                    }
            });

            var targetsT = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            })

            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: "#fff"}});
                }
            } else if (targetsT.length > 0) {
                targetsT.sort((a,b) => a.energy - b.energy)
                if(creep.transfer(targetsT[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetsT[0], {visualizePathStyle: {stroke: "#fff"}});
                }
            } else {
                roleUpgrader.run(creep)
            }
        }
    }
};

module.exports = roleButler;

"use strict";
var roleUpgrader = require("role.upgrader");
var roleHauler = {

    /** @param {Creep} creep **/
    run: function(creep) {

      if (creep.memory.building && _.sum(creep.carry) == 0) {
          creep.memory.building = false;
          creep.say("\ud83d\udc50 Collecting");
      }
      if (!creep.memory.building && _.sum(creep.carry) == creep.carryCapacity) {
          creep.memory.building = true;
          creep.say("\ud83d\udce6 Hauling");
      }

        if(!creep.memory.building) {
            //var sources = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => { return (s.structureType == STRUCTURE_CONTAINER) } });
            var haulerSource = Game.getObjectById(creep.memory.haulerSource);
            var droppedSource = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 2)
            // for moving storage
            if(droppedSource && creep.pickup(droppedSource) == ERR_NOT_IN_RANGE) {
              creep.moveTo(droppedSource, {visualizePathStyle: {stroke: '#fa0'}});
            } else if(creep.withdraw(haulerSource, RESOURCE_LEMERGIUM ) == ERR_NOT_IN_RANGE || creep.withdraw(haulerSource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(haulerSource, {visualizePathStyle: {stroke: '#fa0'}});
            }
        } else {
          if (creep.carry.energy != 0) {
            var targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => {
                        return (s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN) &&
                            s.energy < s.energyCapacity;
                    }
            });
          }
            /*var targetsT = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => {
                    return (s.structureType == STRUCTURE_TOWER) && s.energy < s.energyCapacity;
                }
            });*/
            var targetsS = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (s) => {
                    return (s.structureType == STRUCTURE_STORAGE);
                }
            });
            if(targets != undefined) {
              if(creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets, {visualizePathStyle: {stroke: "#fff"}});
              }
            /*} else if (targetsT.length > 0) {
              if(creep.transfer(targetsT[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targetsT[0], {visualizePathStyle: {stroke: "#fff"}});
              }*/
            } else if (targetsS != "" && creep.room.storage.store[RESOURCE_ENERGY] < targetsS[0].storeCapacity){
              if(creep.transfer(targetsS[0], RESOURCE_LEMERGIUM) == ERR_NOT_IN_RANGE || creep.transfer(targetsS[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targetsS[0], {visualizePathStyle: {stroke: "#fff"}});
              }
            } else {
              roleUpgrader.run(creep);
            }
        }
    }
};

module.exports = roleHauler;

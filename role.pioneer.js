"use strict";
var roleUpgrader = require("role.upgrader");
var rolePioneer = {

  /** @param {Creep} creep **/
  run: function(creep) {
    pioneerFlag = _.filter(Game.flags, f => f.name == "pioneerFlag")
    if (creep.pos.roomName != pioneerFlag[0].pos.roomName) {
     creep.moveToModule(pioneerFlag[0].pos)
    } else {
      if (creep.memory.building && creep.carry.energy == 0) {
        creep.memory.building = false;
        creep.say("Hmm");
      }
      if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
        creep.memory.building = true;
        creep.say("Urg");
      }

      if (!creep.memory.building) {
        var sources = creep.pos.findClosestByPath(FIND_SOURCES);
        var targetsS = creep.room.find(FIND_MY_STRUCTURES, {
          filter: (s) => {
            return (s.structureType == STRUCTURE_STORAGE);
          }
        });
        if (targetsS != "" && creep.room.storage.store[RESOURCE_ENERGY] > 0) {
          if (creep.withdraw(targetsS[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveToModule(targetsS[0]);
          }
        } else if (creep.harvest(sources) == ERR_NOT_IN_RANGE) {
          creep.moveToModule(sources);
        }
      } else {
        var targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
              structure.energy < structure.energyCapacity;
          }
        });
        var targetsT = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
          }
        });
        if (targets != null) {
          if (creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveToModule(targets);
          }
        } else if (targetsT.length > 0) {
          targetsT.sort((a, b) => a.energy - b.energy);
          if (creep.transfer(targetsT[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveToModule(targetsT[0]);
          }
        } else {
          roleUpgrader.run(creep);
        }
      }
    }
  }
};

module.exports = rolePioneer;
"use strict"
var roleUpgrader = require("role.upgrader");
var roleBuilder = {

  /** @param {Creep} creep **/
  run: function(creep) {
    if (creep.memory.building && creep.carry.energy == 0) {
      creep.memory.building = false;
      creep.say("\u26CF harvest")
    }
    if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
      creep.memory.building = true;
      creep.say("\ud83d\udd28 Build");
    }

    if(creep.memory.building) {
      var targets = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

      if (targets) {
        if (creep.build(targets) == ERR_NOT_IN_RANGE) {
          if (creep.moveByPath(creep.memory.pathing) < 0 || !targets.pos.isEqualTo(creep.memory.pathing[creep.memory.pathing.length - 1])){
            creep.memory.pathing = creep.pos.findPathTo(targets,{ignoreCreeps : true});
          }
          //creep.moveTo(targets, {visualizePathStyle: {stroke: "#fff"}});
        }
      } else {
        roleUpgrader.run(creep)        // Next role
      }
    }
    else {
      // **Change to find closest energy
      var sources = creep.pos.findClosestByPath(FIND_SOURCES);
      var targetsS = creep.room.find(FIND_MY_STRUCTURES, {
          filter: (s) => {
              return (s.structureType == STRUCTURE_STORAGE);
          }
      });
      if (targetsS && creep.room.storage.store[RESOURCE_ENERGY] > 0){
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
      }
    }
};

module.exports = roleBuilder;

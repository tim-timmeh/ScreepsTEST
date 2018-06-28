"use strict"
var roleHarvester = require("role.harvester");
var roleUpgrader = require("role.upgrader");
var roleBuilder = require("role.builder");
var roleRepairer = require("role.repairer");
var roleTower = require("role.tower");
var roleMiner = require("role.miner");
var roleHauler = require("role.hauler");

module.exports.loop = function () {

  // *TODO*
  // ** Change AI modules into 1 function with function(creep,role)
  // ** Change priority repair/build > harvester > upgrader on all.
  // ** If harvester = 0 then build WORK,CARRY,MOVE (if all hell breaks loose start from start)
  // ** Dedicated Miner dumps to container.
  // ** Incorperate container Production line miner/hauler/builder etc (instead of universal creeps) (Link?)
  // ** Nearest source if error second source


  // Clear memory of old creeps.
  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log("Clearing non-existing creep memory:", name);
    }
  }

  // ** REDUCE RESPAWNER INTO MODULE FROM HERE --

  // Create array of each creep role.
  var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == "harvester");
  var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == "repairer");
  var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == "upgrader");
  var builders = _.filter(Game.creeps, (creep) => creep.memory.role == "builder");
  var miners = _.filter(Game.creeps, (creep) => creep.memory.role == "miner");
  var newName;
  // Check role array, spawn if below specified count.
  if (harvesters.length < 4) {
    newName = "Emergency Harvester" + Game.time;
    console.log("Harvesters: " + harvesters.length);
    console.log("Spawning new  Emergency harvester: " + newName);
    if (harvesters.length == 0) {
      console.log("WARNING: SPAWNING EMERGENCY CREEP");
      Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {
        memory: {
          role: "harvester"
        }
      });
    } else {
      Game.spawns["Spawn1"].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], newName, {
        memory: {
          role: "harvester"
        }
      });
    }
  } else if (upgraders.length < 1) {
    newName = "Upgrader" + Game.time;
    console.log("Upgraders: " + upgraders.length);
    console.log("Spawning new upgrader: " + newName);
    Game.spawns["Spawn1"].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], newName, {
      memory: {
        role: "upgrader"
      }
    });
  } else if (repairers.length < 1) {
    newName = "Repairer" + Game.time;
    console.log("repairer: " + repairers.length);
    console.log("Spawning new repairer: " + newName);
    Game.spawns["Spawn1"].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], newName, {
      memory: {
        role: "repairer"
      }
    });
  } else if (builders.length < 2) {
    newName = "Builder" + Game.time;
    console.log("Builders: " + builders.length);
    console.log("Spawning new builder: " + newName);
    Game.spawns["Spawn1"].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], newName, {
      memory: {
        role: "builder"
      }
    });
  } else if (miners.length < 2) {
    newName = "Miner" + Game.time;
    console.log("Miners: " + miners.length);
    console.log("Spawning new miner: " + newName);
    Game.spawns["Spawn1"].spawnCreep([WORK, WORK, WORK, WORK, WORK, CARRY, MOVE], newName, {
      memory: {
        role: "miner"
      }
    });
  }
  // Spawn1 Spawning dialog.
  if (Game.spawns["Spawn1"].spawning) {
    var spawningCreep = Game.creeps[Game.spawns["Spawn1"].spawning.name];
    Game.spawns["Spawn1"].room.visual.text(
      "\u2692" + spawningCreep.memory.role,
      Game.spawns["Spawn1"].pos.x + 1,
      Game.spawns["Spawn1"].pos.y, {
        align: "left",
        opacity: 0.8
      });
  }

  // ** TO HERE --

  // Tower AI
  var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
  for (var tower of towers) {
    roleTower.run(tower);
  }

  /*var towers = Game.rooms.W2N55.find(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_TOWER})
  for (var tower of towers) {
      roleTower.run(tower);
  }*/
  // Creep AI
  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    if (creep.memory.role == "harvester") {
      roleHarvester.run(creep);
    }
    if (creep.memory.role == "upgrader") {
      roleUpgrader.run(creep);
    }
    if (creep.memory.role == "builder") {
      // Check for construction otherwise upgrade. ** incorperate else: into module
      var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length) {
        roleBuilder.run(creep);
      } else {
        roleUpgrader.run(creep);
      }
    }
    if (creep.memory.role == "repairer") {
      // Check for repairables, then construction otherwise upgrade. ** incorperate else: into module
      var targetsRepair = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (hp) => hp.hits < hp.hitsMax
      });
      if (targetsRepair) {
        roleRepairer.run(creep)
      } else if (targets.length) {
        roleBuilder.run(creep);
      } else {
        roleUpgrader.run(creep);
      }
    }
    if (creep.memory.role == "miner") {
      roleMiner.run(creep);
    }
    if (creep.memory.role == "hauler") {
      roleHauler.run(creep);
    }
  }
}

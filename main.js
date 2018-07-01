"use strict";
var roleHarvester = require("role.harvester");
var roleUpgrader = require("role.upgrader");
var roleBuilder = require("role.builder");
var roleRepairer = require("role.repairer");
var roleTower = require("role.tower");
var roleMiner = require("role.miner");
var roleHauler = require("role.hauler");

module.exports.loop = function () {

  /*TODO*
   ** Update all creeps to pull from containers not sources
   * breakup main into different modules (spawner etc)
   * Optimise vars to .deserialize from memory if possible, if not do find then .serialize to memory.
   * .serializePath && .deserializePath - if memory false -> Do findClosestByPath -> serialize to memory ->
                                          creep.move via memory -> at error || end = clear memory
  */

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
  var haulers = _.filter(Game.creeps, (creep) => creep.memory.role == "hauler");
  var roomSources = Game.spawns.Spawn1.room.find(FIND_SOURCES);
  //var roomContainers = Game.spawns.Spawn1.room.find(FIND_STRUCTURES, { filter : { structureType : STRUCTURE_CONTAINER }});
  var newName;

  // Check role array, spawn if below specified count.
  if (miners.length + builders.length + harvesters.length + repairers.length + upgraders.length == 0) {
    // - console.log("Harvesters: " + harvesters.length);
    // - if (harvesters.length == 0) {
    newName = "Emergency Harvester" + Game.time;
    console.log("WARNING: SPAWNING EMERGENCY CREEP");
    Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: {
        role: "harvester"
      }
    });
    // -- Old harvester setup
    /*} else {
      newName = "Harvester" + Game.time;
      console.log("Spawning new harvester: " + newName);
      Game.spawns["Spawn1"].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], newName, {
        memory: {
          role: "harvester"
        }
      });
    }*/

  } else if (miners.length < roomSources.length) {
    for (var source of roomSources) {
      console.log("Search creeps > source = minerSource : " + _.filter(Game.creeps, (creep) => creep.memory.minerSource == source.id));
      let filteredCreep = _.filter(Game.creeps, (creep) => creep.memory.minerSource == source.id);
      if (filteredCreep != "") {
        console.log("This source has creep" + source);
        continue;
      } else {
        console.log("This source has no creep" + source);
        newName = "Miner" + Game.time;
        console.log("Spawning new miner: " + newName);
        Game.spawns["Spawn1"].spawnCreep([WORK, WORK, WORK, WORK, WORK, CARRY, MOVE], newName, {
          memory: {
            role: "miner",
            minerSource: source.id
          }
        });
      }
    }
  // -- old hauler
  /*} else if (haulers.length < roomSources.length) {
    newName = "Hauler" + Game.time;
    console.log("Haulers: " + haulers.length + "\nSpawning new hauler: " + newName);
    Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, CARRY , CARRY, MOVE, MOVE], newName, {
      memory : {
        role : "hauler"
      }
    })*/

  } else if (haulers.length < roomSources.length) {
    console.log("Test memory.containers: " + Memory.containers);
    for (var container of Memory.containers) {
      if (_.filter(Game.creeps, (creep) => creep.memory.role == "hauler" && creep.memory.haulerSource == container) == "") {
        newName = "Hauler" + Game.time;
        console.log("Haulers: " + haulers.length + "\nSpawning new hauler: " + newName + "\nFor container : " + container);
        Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, CARRY , CARRY, MOVE, MOVE], newName, {
          memory : {
            role : "hauler",
            haulerSource : container
          }
        });
      } else {
        continue;
      }
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
  }
  // -- Old miner spawn AI
  /*else if (miners.length < 2) {
    newName = "Miner" + Game.time;
    console.log("Miners: " + miners.length);
    console.log("Spawning new miner: " + newName);
    Game.spawns["Spawn1"].spawnCreep([WORK, WORK, WORK, WORK, WORK, CARRY, MOVE], newName, {
      memory: {
        role: "miner"
      }
    });
  }*/

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

  // -- Old Tower AI
  /*var towers = Game.rooms.W2N55.find(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_TOWER})
  for (var tower of towers) {
      roleTower.run(tower);
  }*/

  // Creep AI
  for (var name in Game.creeps) {
    var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
    var creep = Game.creeps[name];
    if (creep.memory.role == "harvester") {
      roleHarvester.run(creep);
    }
    if (creep.memory.role == "upgrader") {
      roleUpgrader.run(creep);
    }
    if (creep.memory.role == "builder") {
      // Check for construction otherwise upgrade.
      // ** incorperate else: into module
      //var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length) {
        roleBuilder.run(creep);
      } else {
        roleUpgrader.run(creep);
      }
    }
    if (creep.memory.role == "repairer") {
      // Check for repairables, then construction otherwise upgrade.
      // ** incorperate else: into module
      var targetsRepair = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (hp) => hp.hits < hp.hitsMax
      });
      if (targetsRepair) {
        roleRepairer.run(creep);
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
};

"use strict";
var roleHarvester = require("role.harvester");
var roleUpgrader = require("role.upgrader");
var roleBuilder = require("role.builder");
var roleRepairer = require("role.repairer");
var roleTower = require("role.tower");
var roleMiner = require("role.miner");
var roleHauler = require("role.hauler");
var roleButler = require("role.butler");

// Is obj empty?
function isEmpty(obj) {
  for(var key in obj) {
    if(obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
};

module.exports.loop = function () {

  /*TODO*
  *** Check if MemoryPathing broke resource pickup from ground
  *** Wipe old containers from memory if they die.
  *** Check how miners are spawned and not limited by haulers as when starting miners will be more (building containers for hauler spawn)
  *** If get stuck do normal move
  ** Creeps get from storage > container > source
  ** Dynamic creep size spawning
  ** Miners to place/build container and add id to memory. (Needs work part)
  ** Upgrader if storage.rangeTo(Upgrader) > 4 then Build Link (Or spawn with MOVE/CARRY parts? untill link?)
  ** Haulers to build Roads
   * while above ~50% storage spawn super || multiple upgraders?
   * find resource(not in mem), add to mem, if hauler.xy close to mem.xy & !carryCapacity, pickup, continue
   * breakup main into different modules (spawner etc)
   * Optimise vars to .deserialize from memory if possible, if not do find then .serialize to memory.
   * .serializePath && .deserializePath - if memory false -> Do findClosestByPath -> serialize to memory ->
                                          creep.move via memory -> at error || end = clear memory
  */

  // Clear memory of old creeps.
  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log("Clearing non-existing creep memory: ", name);
    }
  }

  // Check for claimer flag

  if (!isEmpty(Game.flags) && Game.flags.claimFlag) {
    var claimers = _.filter(Game.creeps, (creep) => creep.memory.role == "claimer");
    if (claimers.length == 0) {
      newName = "Claimer" + Game.time;
      console.log("Spawning new claimer: " + newName);
      spawn.spawnCreep([CLAIM, MOVE], newName, {
        memory: {
          role: "claimer"
        }
      });
    }
  }

  // Multi room - run code on each room
  for (var spawnName in Game.spawns) {
    var spawn = Game.spawns[spawnName]
    var spawnRoomCreeps = spawn.room.find(FIND_MY_CREEPS)
    // Create array of each creep role.
    var harvesters = _.filter(spawnRoomCreeps, (creep) => creep.memory.role == "harvester");
    var repairers = _.filter(spawnRoomCreeps, (creep) => creep.memory.role == "repairer");
    var upgraders = _.filter(spawnRoomCreeps, (creep) => creep.memory.role == "upgrader");
    var builders = _.filter(spawnRoomCreeps, (creep) => creep.memory.role == "builder");
    var miners = _.filter(spawnRoomCreeps, (creep) => creep.memory.role == "miner");
    var haulers = _.filter(spawnRoomCreeps, (creep) => creep.memory.role == "hauler");
    var butlers = _.filter(spawnRoomCreeps, (creep) => creep.memory.role == "butler");
    var roomSources = spawn.room.find(FIND_SOURCES);
    var roomMinerals = spawn.room.find(FIND_MINERALS, { filter : a => a.Amount > 0});
    var roomAllSources = roomSources.concat(roomMinerals)
    //roomSources.push(...roomMinerals)
    var newName;
    var lastContainer

    // Check role array, spawn if below specified count.
    if (butlers.length == 0) {
      newName = "Butler" + Game.time;
      console.log("Spawning new butler: " + newName);
      spawn.spawnCreep([WORK, CARRY, MOVE], newName, {
        memory: {
          role: "butler"
        }
      });

    } else if (miners.length < 1 || (miners.length < roomAllSources.length && haulers.length > 0)) {
      for (var source of roomAllSources) {
        let filteredCreep = _.filter(Game.creeps, (creep) => creep.memory.minerSource == source.id);
        if (filteredCreep != "") {
          continue;
        } else if (roomMinerals != "" && source.id == roomMinerals[0].id) {
          newName = "Mineral Miner" + Game.time;
          console.log("This source has no creep: " + source + "\nSpawning new mineral miner: " + newName);
          spawn.spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName, {
            memory: {
              role: "miner",
              minerSource: source.id
            }
          });
          break;
        } else {
          newName = "Miner" + Game.time;
          console.log("This source has no creep: " + source + "\nSpawning new miner: " + newName);
          spawn.spawnCreep([WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE], newName, {
            memory: {
              role: "miner",
              minerSource: source.id
            }
          });
          break;
        }
      }
    } else if (Memory.containers && haulers.length < Memory.containers.length) {
      for (var container of Memory.containers) {
          if (lastContainer == container) {
            console.log("DUPE")
          }
        if (lastContainer == container || _.filter(Game.creeps, (creep) => creep.memory.role == "hauler" && creep.memory.haulerSource == container) == "") {
          newName = "Hauler" + Game.time;
          console.log("Haulers: " + haulers.length + "\nSpawning new hauler: " + newName + "\nFor container : " + container);
          spawn.spawnCreep([WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], newName, {
            memory : {
              role : "hauler",
              haulerSource : container
            }
          });
          break;
        } else {
          continue;
        }
        //lastContainer = container
      }
    } else if (upgraders.length < 1) {
      newName = "Upgrader" + Game.time;
      console.log("Upgraders: " + upgraders.length + "\nSpawning new upgrader: " + newName);
      spawn.spawnCreep([WORK, WORK, WORK, WORK, CARRY, MOVE], newName, {
        memory: {
          role: "upgrader"
        }
      });
    } else if (repairers.length < 1) {
      newName = "Repairer" + Game.time;
      console.log("repairer: " + repairers.length + "\nSpawning new repairer: " + newName);
      spawn.spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], newName, {
        memory: {
          role: "repairer"
        }
      });
    } else if (builders.length < 1 || (builders.length <= spawn.room.find(FIND_CONSTRUCTION_SITES).length / 10)) {
      newName = "Builder" + Game.time;
      console.log("Builders: " + builders.length + "\nSpawning new builder: " + newName);
      spawn.spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName, {
        memory: {
          role: "builder"
        }
      });
    }

    //Spawning dialog.
    if (spawn.spawning) {
      var spawningCreep = Game.creeps[spawn.spawning.name];
      spawn.room.visual.text(
        "\u2692" + spawningCreep.memory.role,
        spawn.pos.x + 1,
        spawn.pos.y, {
          align: "left",
          opacity: 0.8
        });
    }

    // Tower AI
    var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
    for (var tower of towers) {
      roleTower.run(tower);
    }

    // Creep AI
    for (var name in Game.creeps) {
      var creep = Game.creeps[name];
      var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (creep.memory.role == "butler") {
        roleButler.run(creep);
        continue;
      }
      if (creep.memory.role == "upgrader") {
        roleUpgrader.run(creep);
        continue;
      }
      if (creep.memory.role == "builder") {
        roleBuilder.run(creep);
        continue;
      }
      if (creep.memory.role == "repairer") {
        roleRepairer.run(creep);
        continue;
      }
      if (creep.memory.role == "miner") {
        roleMiner.run(creep);
        continue;
      }
      if (creep.memory.role == "hauler") {
        roleHauler.run(creep);
        continue;
      }
      if (creep.memory.role == "claimer") {
        roleClaimer.run(creep);
        continue;
      }
    }
  }
};

'use strict'

function spawnGroup(room) { // Constructor, framework to build a spawnGroup for a given (room)
  this.room = room;
  this.spawns = room.find(FIND_MY_SPAWNS); // replace with _.filter for lower cpu?
  if (!this.room.memory.spawnMemory) this.room.memory.spawnMemory = {};
  this.memory = this.room.memory.spawnMemory;
  this.extensions = room.findStructures(STRUCTURE_EXTENSION) as StructureExtension[];
  this.manageSpawnLog();
  this.availableSpawnCount = this.getSpawnAvailability();
  this.isAvailable = this.availableSpawnCount > 0;
  this.currentSpawnEnergy = this.room.energyAvailable;
  this.maxSpawnEnergy = this.room.energyCapacityAvailable;
  this.pos = _.head(this.spawns).pos;
}
// Gives built spawngroups methods (functions etc)
spawnGroup.prototype.spawn = function (build, name, memory, reservation)

// functions to assist spawngroup
manageSpawnLog() {
  if (!this.memory.log) this.memory.log = {availability: 0, history: [], longHistory: []};

  if (Game.time % 100 !== 0) return; // early
  let log = this.memory.log;
  let average = log.availability / 100;
  log.availability = 0;
  /*
  if (average > 1) console.log("SPAWNING:", this.room, "not very busy (avg", average, "idle out of",
  this.spawns.length, "), perhaps add more harvesting");
  if (average < .1) console.log("SPAWNING:", this.room, "very busy (avg", average, "idle out of",
  this.spawns.length, "), might want to reduce harvesting");
  */
  log.history.push(average);
  while (log.history.length > 5) log.history.shift();

  if (Game.time % 500 !== 0) return; // early
  let longAverage = _.sum(log.history) / 5;
  log.longHistory.push(longAverage);
  while (log.history.length > 5) log.history.shift();
}

getSpawnAvailability() {
  let count = 0;
  for (let spawn of this.spawns) {
    if (spawn.spawning == null) {
      count++;
    }
  }
  this.memory.log.availability += count;
  Memory.stats["spawnGroups." + this.room.name + ".idleCount"] = count;
  return count;
}

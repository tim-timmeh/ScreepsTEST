'use strict'
require('SpawnGroup')

function Mission(operation, name) {
  this.name = name
  this.opName = operation.name
  this.opType = operation.type
  this.flag = operation.flag
  this.room = operation.room
  this.king = operation.king
  this.spawnGroup = operation.spawnGroup
  this.sources = operation.Sources
  if (!operation.flag.memory[this.name]) operation.flag.memory[this.name] = {};
  this.memory = operation.flag.memory[this.name];
  if (this.room) this.hasVision = true;
}

Mission.prototype.init = function () { // Initialize / build objects required

};
Mission.prototype.rolecall = function () { // perform rolecall on required creeps spawn if needed

};
Mission.prototype.action = function () { // perform actions / missions

};
Mission.prototype.finalize = function () { // finalize?

};

// Additional methods/functions below
Mission.prototype.creepRoleCall = function (roleName, creepBody, creepAmount = 1, options = {} ) { // what mission needs. job name, what kinda body, how many, additional options (Pre-spawn, priority reservation etc)
  let creepArray = [];
  if (!this.memory.spawn[roleName]) {
    this.memory.spawn[roleName] = this.getLostCreeps(roleName);
  }
  let creepCount = 0;
  for (let i = 0; i < this.memory.spawn[roleName].length; i++) {
    let creepName = this.memory.spawn[roleName][i];
    let creep = Game.creeps[creepName];
    if (creep){
      creepArray.push(creep);
      let creepPrespawnTicks = 0;
      if (options.prespawn != undefined) { // eg if prespawn is 30ticks
        creepPrespawnTicks += creep.body.length * 3; // each bodypart = 3s
        creepPrespawnTicks += options.prespawn; // add prespawn timer to spawn timer (miner 30 ticks from base + time to spawn = get there when old miner dies)
      }
      if (creep.ticksToLive > creepPrespawnTicks || creep.spawning) {
        creepCount++;
      }
    } else {
      this.memory.spawn[roleName].splice(i, 1);
      Memory.creeps[creepName] = undefined;
      i--
    }
  }
  if (this.SpawnGroup.isAvailable && creepCount < creepAmount && this.hasVision) {
    let creepName = this.opName.substring(9,12) + '.' + this.roleName.substring(0,3) + '.' + (Game.time % 100);
    if (this.SpawnGroup.spawn(creepBody, creepName, options.memory) == 0) {
      this.memory.spawn[roleName].push(creepName);
    }
  }
  return creepArray;
};

/**
 * [Takes creep body and multiplies by max energy available, with options. Returns creep body array for spawning]
 * @param  {Object} bodyConfig   [Object containing bodypart as Key and amount as Value eg {move:3,attack:2}]
 * @param  {Object} [options={}] [maxRatio = max block multiplier
 *                                maxEnergyPercent = max spawn ratio eg ration energy use % below max
 *                                forceSpawn = spawn at available energy or 300
 *                                keepFormat = duplicates body structure instead of making it even]
 * @return {[Array]}              [Returns body ready for spawning]
 */
Mission.prototype.getBody = function (bodyConfig, options = {}) { //, ,
  let blockEnergyReq = 0
  let blockPartsReq = 0;
  for (let bodyPart in bodyConfig) { // bodypart = object key
    blockEnergyReq += BODYPART_COST[bodyPart.toLowerCase()] * bodyConfig[bodyPart];
    blockPartsReq += bodyConfig[bodyPart];
  }
  let blockLimit = options.maxRatio ? blockPartsReq * options.maxRatio : Math.floor(50 / blockPartsReq);
  let energyPool = options.forceSpawn ? Math.max(this.spawnGroup.currentSpawnEnergy, 300) : this.spawnGroup.maxSpawnEnergy; // if forceSpawn true then spawn with current energy or 300(incase total creep death?)
  let blockMultiplier = Math.min(Math.floor(energyPool * (options.maxEnergyPercent / 100 || 1) / blockEnergyReq), blockLimit); // block multipler
  let creepBody = []
  if (options.keepFormat) {
    for (let bodyPart in bodyConfig) {
      creepBody = creepBody.push(bodyPart.toUpperCase())
    }
    let arrays = Array.apply(null, new Array(blockMultiplier));// Create an array of size "n" with undefined values
    arrays = arrays.map(function() { return creepBody });// Replace each "undefined" with our array, resulting in an array of n copies of our array
    creepBody = [].concat.apply([], arrays) // Flatten our array of arrays and apply to creepBody
  } else {
    for (let bodyPart in bodyConfig) {
      creepBody = creepBody.concat(Array((bodyConfig[bodyPart] * blockMultiplier)).fill(bodyPart.toUpperCase()));
    }
  }
  return creepBody
}

Mission.prototype.findDistanceToSpawn = function (destination) { // pass a room position and find distance to spawn group
  if (!this.memory.distanceToSpawn) {
    this.memory.distanceToSpawn = this.room.findPath(this.spawnGroup.pos, destination, {ignoreCreeps : true}).length - 1; //generates path from spawn to source -1 because creep doesnt stand ontop of source
  }
  return this.memory.distanceToSpawn
}

// Mission.prototype.getBodyWorker = function (work, carry, move, options = {} ) {//maxRatio, maxEnergyPercent, forceSpawn keepFormat) { // Ratio of work/carry/move parts, max spawn ratio eg, ration energy use % below max
//   let blockEnergyReq = work * 100 + carry * 50 + move * 50; // get energy per creep block
//   let blockPartsReq = work + carry + move; // get amount of parts per creep block
//   let blockLimit = options.maxRatio ? blockPartsReq * options.maxRatio : Math.floor(50 / blockPartsReq); // max amount of blocks for creep
//   let energyPool = options.forceSpawn ? Math.max(this.spawnGroup.currentSpawnEnergy, 300) : this.spawnGroup.maxSpawnEnergy; // if forceSpawn true then spawn with current energy or 300(incase total creep death?)
//   let blockMultiplier = Math.min(Math.floor(energyPool * (options.maxEnergyPercent / 100 || 1) / blockEnergyReq), blockLimit); // block multipler
//   let creepBody = [];
//   for (let i = 0; i < work * blockMultiplier; i++){
//     creepBody.push(WORK);
//   }
//   for (let i = 0; i < carry * blockMultiplier; i++){
//     creepBody.push(CARRY);
//   }
//   for (let i = 0; i < move * blockMultiplier; i++){
//     creepBody.push(MOVE);
//   }
//   return creepBody
// };
//
// Mission.prototype.getBodyFighter = function (){
//
// }

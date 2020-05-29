'use strict'
require('SpawnGroup')

//** Set emergency room mode incase of wipe/fresh spawn.

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
    console.log('Code TODO getlostcreeps');
    this.memory.spawn[roleName] = this.getLostCreeps(roleName); // DO GET LOST CREEPS FUNCTION
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
*                                addBodyPart = add non multiplying bodypart to bodyConfig
*                                removeBodyPart = remove a body part (eg in haulers require 1-2 move/carry ratio but -1 carry for work)
* @return {[Array]}              [Returns body ready for spawning]
*/
Mission.prototype.getBody = function (bodyConfig, options = {}) { //, ,

  // let blockEnergyReqExtra = 0;
  // let blockPartsReqExtra = 0;
  //  let blockEnergyReq = 0;
  //  let blockPartsReq = 0;
  //
  // for (let bodyPart in bodyConfig) { // bodypart = object key
  //   blockEnergyReq += BODYPART_COST[bodyPart.toLowerCase()] * bodyConfig[bodyPart];
  //   blockPartsReq += bodyConfig[bodyPart];
  // }

  let { blockEnergyReq, blockPartsReq } = this.bodyBlockReq(bodyConfig);
  let { blockEnergyReq:blockEnergyReqExtra, blockPartsReq:blockPartsReqExtra } = this.bodyBlockReq(options.addBodyPart); //var { name: nameA } = { name: "Bender" }; console.log(nameA) == "Bender"
  // if (options.addBodyPart) { // Non multiplying body part calculation
  //   for (let bodyPart in options.addBodyPart) { // bodypart = object key
  //     blockEnergyReqExtra += BODYPART_COST[bodyPart.toLowerCase()] * options.addBodyPart[bodyPart];
  //     blockPartsReqExtra += options.addBodyPart[bodyPart];
  //   }
  // }

  let blockLimit = options.maxRatio ? options.maxRatio : Math.floor((50 - blockPartsReqExtra) / blockPartsReq); //Work out max bodypart ratio - addBodyPart
  let energyPool = options.forceSpawn ? Math.max(this.spawnGroup.currentSpawnEnergy, 300) : this.spawnGroup.maxSpawnEnergy; // if forceSpawn true then spawn with current energy or 300(incase total creep death?)
  let blockMultiplier = Math.min(Math.floor((energyPool - blockEnergyReqExtra) * (options.maxEnergyPercent / 100 || 1) / blockEnergyReq), blockLimit); // works out available block multipler (maxratio vs max energy available), minus addBodyPart

  let creepBody = []
  if (options.keepFormat) { //To keep format eg [WORK, CARRY, MOVE, WORK, CARRY, MOVE]
    for (let bodyPart in bodyConfig) {
      creepBody.push(bodyPart.toUpperCase())
    }
    let arrays = Array.apply(null, new Array(blockMultiplier));// Create an array of size "n" with undefined values
    arrays = arrays.map(function() { return creepBody });// Replace each "undefined" with our array, resulting in an array of n copies of our array
    creepBody = [].concat.apply([], arrays) // Flatten our array of arrays and apply to creepBody
  } else { //Spreads Format eg [WORK, WORK, CARRY, CARRY, MOVE, MOVE]
    for (let bodyPart in bodyConfig) {
      creepBody = creepBody.concat(Array((bodyConfig[bodyPart] * blockMultiplier)).fill(bodyPart.toUpperCase()));
    }
  }
  if (options.addBodyPart) { // add non multiplying body parts to end
    for (let bodyPart in options.addBodyPart) {
      creepBody = creepBody.concat(Array((options.addBodyPart[bodyPart])).fill(bodyPart.toUpperCase()));
    }
  }
  if (options.removeBodyPart){
    let partIndex = creepBody.findIndex((p) => p == options.removeBodyPart.toUpperCase())
    if (partIndex > -1) {
      creepBody.splice(partIndex, 1);
    }
  }
  return creepBody
}

Mission.prototype.bodyBlockReq = function (bodyConfig) { // return object {blockEnergyReq:0,blockPartsReq:0}
  let blockEnergyReq
  let blockPartsReq
  for (let bodyPart in bodyConfig) { // bodypart = object key
    blockEnergyReq += BODYPART_COST[bodyPart.toLowerCase()] * bodyConfig[bodyPart];
    blockPartsReq += bodyConfig[bodyPart];
  }
  return {blockEnergyReq:blockEnergyReq, blockPartsReq:blockPartsReq}
}

Mission.prototype.findDistanceToSpawn = function (destination) { // pass a room position and find distance to spawn group
  if (!this.memory.distanceToSpawn) {
    this.memory.distanceToSpawn = this.room.findPath(this.spawnGroup.pos, destination, {ignoreCreeps : true}).length - 1; //generates path from spawn to source -1 because creep doesnt stand ontop of source
  }
  return this.memory.distanceToSpawn
}

Mission.prototype.findStorage = function (position) { // pass a room position and return closest storage object
  let storage
  if (this.room.storage && this.room.storage.my) { //if no mem find storage in room
    //this.memory.storageID = this.room.storage.id;
    storage = this.room.storage;
    return storage
  }
  if (this.memory.storageID) { // if storage in memory
    storage = Game.getObjectById(this.memory.storageID);
    if (storage && storage.room.controller.level >=4) { //check still true
      return storage
    }
    if (global.debug) console.log(`Error finding storage from memory, clearing - ${this.room} - ${this.opName} - ${this.name}`);
    this.memory.storageID = ""; //else reset memory
  }
  if (this.room.controller.my) { // added this part, dont want miners to take energy from room when bootstrapping?
    if (global.debug) console.log(`Error finding storage, room looks to be in construction - ${this.room} - ${this.opName} - ${this.name}`)
    return
  }

  if (this.spawnGroup.room.storage && this.spawnGroup.room.storage.my){ //if none in room find spawngroup room storage
    this.memory.storageID = this.spawnGroup.room.storage.id;
    if (global.debug) console.log(`Using spawnGroup Storage @ ${this.spawnGroup.room.name} for ${this.room} - ${this.opName} - ${this.name}`)
    return storage
  }

  // ADD KING STORAGES?
  try {
    let storages = _.filter(this.king.storages, (storage) => storage.room.controller.level >= 4); // if none in spawngroup search all storage
    if (storages.length == 0) return;
    if (storages.length == 1) return storages; // if only 1 return that one, (add check for distance by room maybe?)
    let sorted = _.sortBy(storages, (s) => Game.map.findPathTo(s.pos.roomName, position).length); // else find closest. VERY EXPENSIVE? refactor better solution
    if (global.debug) console.log(`Error finding storage, Searching all & finding closest - ${this.room} - ${this.opName} - ${this.name}\nFound ${sorted[0]}`);
    return sorted[0];
  } catch (e) {
    console.log(`FORGOT TO ADD KING.STORAGES @ ${__file} : ${__line}\n${e.stack}`) // if error console log stack at error
  }
}

Mission.prototype.analyzeHauler = function (distance, regen){
  if (!this.memory.haulerAnalysis || regen !== this.memory.haulerAnalysis.regen) {
    // distance to travel * there and back (and a little extra) * regen per tick
    let totalTickRegen = distance * 2.1 * load ;
    // creepBlock capacity = 100 (2 CARRY, 1 MOVE)
    let creepBlocksNeeded = Math.ceil(totalTickRegen / 100);
    let maxUnitsPossible = this.spawnGroup.maxUnits([CARRY, CARRY, MOVE]);
    let cartsNeeded = Math.ceil(cargoUnitsNeeded / maxUnitsPossible );
    let cargoUnitsPerCart = Math.ceil(cargoUnitsNeeded / cartsNeeded);
    let body = this.workerBody(0, cargoUnitsPerCart * 2, cargoUnitsPerCart);
    this.memory.transportAnalysis = {
      load: load,
      distance: distance,
      body: body,
      cartsNeeded: cartsNeeded,
      carryCount: cargoUnitsPerCart * 2 };
    }
    return this.memory.transportAnalysis;
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

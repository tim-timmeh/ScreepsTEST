'use strict'
require('SpawnGroup')

function Mission(operation, name) {
  this.name = name
  this.opName = operation.name
  this.opType = operation.type
  this.flag = operation.flag
  this.room = operation.room
  this.king = operation.king
  this.SpawnGroup = operation.SpawnGroup
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

Mission.prototype.getBodyWorker = function (work, carry, move, options = {} ) {//maxRatio, maxEnergyPercent, forceSpawn) { // Ratio of work/carry/move parts, max spawn ratio eg, ration energy use % below max
  let blockEnergyReq = work * 100 + carry * 50 + move * 50; // get energy per creep block
  let blockPartsReq = work + carry + move; // get amount of parts per creep block
  let blockLimit = options.maxRatio ? blockPartsReq * options.maxRatio : Math.floor(50 / blockPartsReq); // max amount of blocks for creep
  let energyPool = options.forceSpawn ? Math.max(this.spawnGroup.currentSpawnEnergy, 300) : this.spawnGroup.maxSpawnEnergy; // if forceSpawn true then spawn with current energy or 300(incase total creep death?)
  let blockMultiplier = Math.min(Math.floor(energyPool * (options.maxEnergyPercent / 100 || 1) / blockEnergyReq), blockLimit); // block multipler
  let creepBody = [];
  for (let i = 0; i < work * blockMultiplier; i++){
    creepBody.push(WORK);
  }
  for (let i = 0; i < carry * blockMultiplier; i++){
    creepBody.push(CARRY);
  }
  for (let i = 0; i < move * blockMultiplier; i++){
    creepBody.push(MOVE);
  }
  return creepBody
};
'use strict'

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
Mission.prototype.creepRoleCall = function (roleName, creepBody, amount = 1, options = {} ) { // what mission needs. job name, what kinda body, how many, additional options (Pre-spawn, priority reservation etc)
  let creepArray = [];
  if (!this.memory.spawn[roleName]) {
    this.memory.spawn[roleName] = this.getLostCreeps(roleName);
  };
  let creepCount = 0;
  for (let i = 0; i < this.memory.spawn[roleName].length; i++) {
    let creepName = this.memory.spawn[roleName][i];
    let creep = Game.creeps[creepName];
    if (creep){
      let creepPrespawnTicks = 0;
      if (options.prespawn != undefined) { // eg if prespawn is 30ticks
        creepPrespawnTicks += creep.body.length * 3; // each bodypart = 3s
        creepPrespawnTicks += options.prespawn; // add prespawn timer to spawn timer (miner 30 ticks from base + time to spawn = get there when old miner dies)
      };
      if (creepPrespawnTicks < creep.ticksToLive || creep.spawning) {
        creepCount++;
      }
    } else {
      this.memory.spawn[roleName].splice(i, 1);
      Memory.creeps[creepName] = undefined;
      i--
    }
  }
  if (this.spawnGroup.isAvailable && creepCount < amount && this.hasVision) {
    let creepName = this.opName.substring(8,3) + '.' + this.roleName.substring(0,3) + ' ' + (Game.time % 100);//Game.time.substring(-3,3)
  }
};

Mission.prototype.bodyWorker = function (work, carry, move, amount = 1, maxRatio = 99) { // Ratio of work/carry/move parts, How many Creeps, max spawn ratio eg, butler stays 1/1/1 hauler go to max room capacity

};

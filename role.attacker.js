"use strict";
var roleUpgrader = require("role.upgrader");
var roleBuilder = require("role.builder");
var rolePioneer = require("role.pioneer");
require("moveToModule");
var attackerFlag;
var roleAttacker = {

  /** @param {Creep} creep **/
  run: function(creep) {
    attackerFlag = _.filter(Game.flags, f => f.name == "attackerFlag")
    if (creep.pos.roomName != attackerFlag[0].pos.roomName) {
     creep.moveToModule(attackerFlag[0].pos)
    } else {
      if (creep.hits < creep.hitsMax) {
        creep.heal(creep)
      }
      var enemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS)
      if (enemy.length) {
        if (creep.attack(enemy) == ERR_NOT_IN_RANGE) {
          creep.moveToModule(enemy);
        }
      } else {
        rolePioneer.run(creep);
      }
    }
  }
};

module.exports = roleAttacker;

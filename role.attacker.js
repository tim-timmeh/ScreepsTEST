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
    if (attackerFlag[0] && creep.pos.roomName != attackerFlag[0].pos.roomName) {
     creep.moveToModule(attackerFlag[0].pos)
    } else {
      var enemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS)
      if (enemy) {
        if (creep.attack(enemy) == ERR_NOT_IN_RANGE) {
          creep.moveToModule(enemy);
        }
      } else if (!creep.pos.isNearTo(attackerFlag)) {
        creep.moveToModule(attackerFlag[0].pos)
      } if (!enemy && creep.hits < creep.hitsMax) {
        creep.heal(creep)
      }
    }
  }
};

module.exports = roleAttacker;

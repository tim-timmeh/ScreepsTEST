"use strict";
require("moveToModule");
var claimFlag
var roleClaimer = {

  /** @param {Creep} creep **/
  run: function(creep) {
    claimFlag = _.filter(Game.flags, f => f.name == "claimFlag")
    if (creep.pos.roomName != claimFlag[0].pos.roomName) {
     creep.moveToModule(claimFlag[0].pos)
    } else {
     if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
       creep.moveToModule(creep.room.controller);
     }
   }
  }
};

module.exports = roleClaimer;

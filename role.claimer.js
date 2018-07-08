"use strict";
require("moveToModule");
var claimFlag
var roleClaimer = {

  /** @param {Creep} creep **/
  run: function(creep) {
    claimFlag = _.filter(Game.flags, f => f.name == "claimFlag")
    if (creep.pos.roomName != claimFlag.pos.roomName)
     creep.moveToModule(claimFlag.pos)
   } else {
     if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
       creep.moveToModule(creep.room.controller);
     }
   }
  }
};

module.exports = roleClaimer;

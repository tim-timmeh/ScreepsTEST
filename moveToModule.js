"use strict";
var positionMem;

Creep.prototype.moveToModule = function(destination, ignore = true) {
  if (this.moveByPath(this.memory.pathing) < 0 || !destination.pos.isEqualTo(this.memory.pathing[this.memory.pathing.length - 1].x, this.memory.pathing[this.memory.pathing.length - 1].y)) {
    this.memory.pathing = this.pos.findPathTo(destination, {
      ignoreCreeps: ignore
    });
  } else if (Game.time % 2 == 0) {
    if (this.memory.position != undefined) {
      positionMem = new RoomPosition(this.memory.position.x, this.memory.position.y, this.memory.position.roomName);
    }
    if (this.memory.position != undefined && this.pos.toString() == positionMem.toString()) {
      console.log("STUCK DETECTED, FINDING NEW PATH\n" + this.name);
      this.memory.pathing = this.pos.findPathTo(destination, {
        ignoreCreeps: false
      });
    } else {
      this.memory.position = this.pos;

    }
  }
};

module.exports = Creep.prototype.moveToModule;

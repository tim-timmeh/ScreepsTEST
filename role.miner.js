"use strict"
/*
 for range miners - container underneath? mine : construction underneath ? energy at 50 ? continue construction : mine : build container;
*/
var roleMiner = {

  run: function (creep) {
    let source = Game.getObjectById(creep.memory.minerSource)
		if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
      if (creep.moveByPath(creep.memory.pathing) < 0 || !source.pos.isEqualTo(creep.memory.pathing[creep.memory.pathing.length - 1])){
        creep.memory.pathing = creep.pos.findPathTo(source,{ignoreCreeps : true});
      }
      //creep.moveTo(source, {visualizePathStyle: {stroke: '#fa0'}});
	  }
  }
}
module.exports = roleMiner;

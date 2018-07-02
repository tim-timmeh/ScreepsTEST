"use strict"
/*
 for range miners - container underneath? mine : construction underneath ? energy at 50 ? continue construction : mine : build container;
*/
var roleMiner = {

  run: function (creep) {
    let source = Game.getObjectById(creep.memory.minerSource)
		if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
      creep.moveTo(source, {visualizePathStyle: {stroke: '#fa0'}});
	  }
  }
}
module.exports = roleMiner;

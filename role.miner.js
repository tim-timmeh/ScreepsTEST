"use strict"
/*
global memory {roomName:{sourceID:{Mining , Hauling}}} and miners and haulers check then assign themselves into a gap?
*/
var roleMiner = {

  run: function (creep) {
		var thiscreep = creep
		var sources = creep.room.find(FIND_SOURCES);
		console.log(sources[0].pos.findInRange(FIND_MY_CREEPS, 1) == false || thiscreep)
		console.log(thiscreep)
		console.log(sources[0].pos.findInRange(FIND_MY_CREEPS, 1))

		if (sources[0].pos.findInRange(FIND_MY_CREEPS, 1) == false || thiscreep ) {
	    if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
	      creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#fa0'}});
	    }
		} else {
			if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
	      creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#fa0'}});
	    }
		}
  }
}
module.exports = roleMiner;

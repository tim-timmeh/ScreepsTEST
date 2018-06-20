var roleMiner = {

	run: function(creep) {
		var sources = creep.pos.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#fa0'}});
            }
	}
}

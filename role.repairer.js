var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say("ð harvest");
	    }
	    if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say("ð§ Repair");
	    }

	    if(creep.memory.building) {
	        var targetsRepair = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter : (hp) => hp.hits < hp.hitsMax});
	        //console.log("Repairing: " + targetsRepair + " - " + targetsRepair.hits + "/" + targetsRepair.hitsMax)
            if (targetsRepair) {
                if (creep.repair(targetsRepair) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetsRepair, {visualizePathStyle: {stroke: "#ffffff"}});
                }
            }
	    }
	    else {
	        // **Change to find closest energy
	        var sources = creep.pos.findClosestByPath(FIND_SOURCES);
            if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
	    }
	}
};

module.exports = roleRepairer;
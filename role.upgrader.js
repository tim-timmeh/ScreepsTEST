var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    
        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say("🔄 harvest");
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say("🚧 Upgrade");
        }

        if (!creep.memory.building) {
            // **Change to find closest energy
            var sources = creep.pos.findClosestByPath(FIND_SOURCES);
            if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
	}
};

module.exports = roleUpgrader;
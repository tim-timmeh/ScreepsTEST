var roleUpgrader = require("role.upgrader");
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say("🔄 harvest");
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say("🚧 Storage");
        }

        if(!creep.memory.building) {
            // **Change to find closest energy
            var sources = creep.pos.findClosestByPath(FIND_SOURCES);
            if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
                    }
            });

            var targetsT = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            })

            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else if (targetsT.length > 0) {
                if(creep.transfer(targetsT[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetsT[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                roleUpgrader.run(creep)
            }
        }
    }
};

module.exports = roleHarvester;
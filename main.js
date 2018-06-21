var roleHarvester = require("role.harvester");
var roleUpgrader = require("role.upgrader");
var roleBuilder = require("role.builder");
var roleRepairer = require("role.repairer");
var roleTower = require("role.tower");
//var roleMiner = require("role.miner");

module.exports.loop = function () {

    // *TODO*
    // ** Change AI modules into 1 function with function(creep,role)
    // ** Change priority repair/build > harvester > upgrader on all.
    // ** If harvester = 0 then build WORK,CARRY,MOVE (if all hell breaks loose start from start)
    // ** If creep.pos no road then build construction_site road
    // ** Dedicated Miner dumps to container.
    // ** Incorperate container Production line miner/hauler/builder etc (instead of universal creeps) (Link?)
    // ** Nearest source if error second source

    // REDUCE RESPAWNER INTO MODULE FROM HERE --

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    if (harvesters.length < 4 ) {
        console.log('Harvesters: ' + harvesters.length);
    }

    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    if (repairers.length < 1 ) {
        console.log('repairer: ' + repairers.length);
    }

    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    if (upgraders.length < 1 ) {
        console.log('Upgraders: ' + upgraders.length);
    }

    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    if (builders.length < 2 ) {
        console.log('Builders: ' + builders.length);
    }

    /*var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
    if (miners.length < 2 ) {
        console.log('Miners: ' + miners.length);
    }*/

    if(harvesters.length < 4) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], newName,
            {memory: {role: 'harvester'}});
    } else if(upgraders.length < 1) {
        var newName = 'Upgrader' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], newName,
            {memory: {role: 'upgrader'}});
    } else if(repairers.length < 1) {
        var newName = 'repairer' + Game.time;
        console.log('Spawning new repairer: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], newName,
            {memory: {role: 'repairer'}});
    } else if(builders.length < 2) {
        var newName = 'Builder' + Game.time;
        console.log('Spawning new builder: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], newName,
            {memory: {role: 'builder'}});
    } /*else if (miners.length < 2) {
        var newName = "Miner" + Game.time;
        console.log("Spawning new miner: " + newName);
        Game.spawns["Spawn1"].spawnCreep([WORK,WORK,WORK,WORK,WORK,MOVE,MOVE], newName, {memory: {role: "miner"}});
    }*/

    if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            "\u2692" + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }






    // TO HERE --
    var towers = Game.rooms.W2N55.find(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_TOWER})
    //console.log(towers)
    for (var tower of towers) {
        //console.log("test find tower" + tower);
        roleTower.run(tower);
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == "harvester") {
            //if (Game.spawns.Spawn1.room.energyAvailable != Game.spawns.Spawn1.room.energyCapacityAvailable) {
                roleHarvester.run(creep);
            //} else {
            //    roleUpgrader.run(creep);
            //}
        }
        if (creep.memory.role == "upgrader") {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == "builder") {
        	// check for construction otherwise upgrade
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                roleBuilder.run(creep);
            } else {
                roleUpgrader.run(creep);
            }
        }
        if (creep.memory.role == "repairer") {
            var targetsRepair = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter : (hp) => hp.hits < hp.hitsMax});
            if (targetsRepair) {
                roleRepairer.run(creep)
            } else if (targets.length) {
                roleBuilder.run(creep);
            } else {
                roleUpgrader.run(creep);
            }
        }
    }
}

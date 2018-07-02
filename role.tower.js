"use strict"
//* Target creeps without tough first?

var roleTower = {

	run: function(tower) {
		var enemy = tower.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
		var targetsMyRepair = tower.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter : (hp) => hp.hits < (hp.hitsMax - 800)});
 		//--var targetsRepair = tower.pos.findClosestByPath(FIND_STRUCTURES, {filter : (hp) => hp.hits < hp.hitsMax})
		// get all damaged structures and list from lowest hits
		var targetsRepairLowestHp = tower.room.find(FIND_STRUCTURES, {filter : (hp) => hp.hits < (hp.hitsMax - 800) && hp.hits < 90000000});
		var targetsCreepRepair = _.filter(Game.creeps, (creep) => creep.hits < creep.hitsMax);
		targetsRepairLowestHp.sort((a,b) => a.hits - b.hits);
		if (enemy) {
			console.log("Enemy Found, \ud83d\udd2b Attacking " + enemy);
			tower.attack(enemy);
		// Heal creeps while above 25% energy
	} else if (targetsCreepRepair != "" && tower.energy > (tower.energyCapacity * 0.25)) {
			tower.heal(targetsCreepRepair[0]);
		// Repair my structures while above 50% energy
		} else if (targetsMyRepair && tower.energy > (tower.energyCapacity * 0.5)) {
			tower.repair(targetsMyRepair);
		// Repair all structures while above 75% energy
		} else if (targetsRepairLowestHp && tower.energy > (tower.energyCapacity * 0.75)) {
			tower.repair(targetsRepairLowestHp[0]);
		}
	}
};

module.exports = roleTower;

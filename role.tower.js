//++ Target creeps without tough first?

var roleTower = {

	run: function(tower) {
		var enemy = tower.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
		var targetsMyRepair = tower.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter : (hp) => hp.hits < hp.hitsMax})
 		//--var targetsRepair = tower.pos.findClosestByPath(FIND_STRUCTURES, {filter : (hp) => hp.hits < hp.hitsMax})
		// get all damaged structures and list from lowest hits
		var targetsRepairLowestHp = tower.room.find(FIND_STRUCTURES, {filter : (hp) => hp.hits < hp.hitsMax})
		targetsRepairLowestHp.sort((a,b) => a.hits - b.hits)
		if (enemy) {
			console.log("Enemy Found, \ud83d\udd2b Attacking " + enemy);
			tower.attack(enemy);
		} else if (targetsMyRepair) {
			tower.repair(targetsMyRepair)
		} else if (targetsRepairLowestHp && tower.energy > (tower.energyCapacity * 0.75)) {
			tower.repair(targetsRepairLowestHp[0])
		}
	}
};

module.exports = roleTower;

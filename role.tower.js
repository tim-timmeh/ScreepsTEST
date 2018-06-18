var roleTower = {
	
	run: function(tower) {
		var enemy = tower.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
		var targetsMyRepair = tower.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter : (hp) => hp.hits < hp.hitsMax})
 		var targetsRepair = tower.pos.findClosestByPath(FIND_STRUCTURES, {filter : (hp) => hp.hits < hp.hitsMax})

		if (enemy) {
			console.log("Enemy Found, Attacking " + enemy);
			tower.attack(enemy);
		} else if (targetsMyRepair) {
			tower.repair(targetsMyRepair)
		} else if (targetsRepair && tower.energy > (tower.energyCapacity / 2)) {
			tower.repair(targetsRepair)
		}
	}
};

module.exports = roleTower;
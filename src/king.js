'use strict'

function king() { // constructor, how to build the object

}
king.prototype.init = function () { // Initialize / build objects required

};
king.prototype.rolecall = function () { // perform rolecall on required creeps spawn if needed

};
king.prototype.action = function () { // perform actions / missions

};
king.prototype.finalize = function () { // finalize?

};

// Additional methods/functions below

king.prototype.getSpawnGroup = function (roomName) {
        if (this.spawnGroups[roomName]) {
            return this.spawnGroups[roomName];
        }
        else {
            let room = Game.rooms[roomName];
            if (room && room.find(FIND_MY_SPAWNS).length > 0) {
                this.spawnGroups[roomName] = new SpawnGroup(room);
                return this.spawnGroups[roomName];
            }
        }
    }

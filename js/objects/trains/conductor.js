var Util = require('../../util/util.js');
var trains = require('../../objectArrays/trains.js');
var movers = require('../../objectArrays/movers.js');

var Conductor = function (zone) {
  this.zone = zone;
  this.trains = trains;
  this.movers = movers;
  this.time = 0;
};

Conductor.prototype.manageTrains = function () {
  switch (this.zone.name) {
    case "Throop":
      var ACar = require('./aCar.js');
      if (Util.typeCount("skeleton", this.movers) <= 1) {
        if (Util.typeCount("aCar", this.trains) === 0) {
          this.trains.push(new ACar (trains.length, "front", -1300, this.zone.trainY-100, 26, -0.1));
          this.trains.push(new ACar (trains.length, "middle", -1540, this.zone.trainY-100, 26, -0.1));
          this.trains.push(new ACar (trains.length, "middle", -1780, this.zone.trainY-100, 26, -0.1));
          this.trains.push(new ACar (trains.length, "middle", -2020, this.zone.trainY-100, 26, -0.1));
          this.trains.push(new ACar (trains.length, "middle", -2260, this.zone.trainY-100, 26, -0.1));
          this.trains.push(new ACar (trains.length, "rear", -2500, this.zone.trainY-100, 26, -0.1));
        }
      }
    break;
  }
};

module.exports = Conductor;

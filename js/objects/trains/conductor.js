var Util = require('../../util/util.js');
var movers = require('../../objectArrays/movers.js');
var A = require('./A.js');

var Conductor = function (zone) {
  this.zone = zone;
  this.movers = movers;
  this.time = 0;
};

Conductor.prototype.manageTrains = function () {
  switch (this.zone.name) {
    case "Throop":
    var ATrain = require('./A.js');
    if (Util.typeCount("skeleton", movers) === 0) {
      if (Util.typeCount("aTrain", movers) === 0) {
        this.train = new A (movers.length, -1000, this.zone.trainHeight);
      }
    }
    break;
  }
};

module.exports = Conductor;

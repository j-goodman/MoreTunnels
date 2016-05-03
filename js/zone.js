var Block = require("./objects/block.js");
var Player = require("./objects/player.js");

var Zone = function (blueprint) {
  this.blueprint = blueprint;
};

// X Top of a platform
// Y Middle of a platform

Zone.prototype.build = function (blocks) {
  this.blueprint.forEach(function (yLine, yIndex) {
    yLine.split("").forEach(function (square, xIndex) {
      if (square === "X") {
        blocks.push( new Block (xIndex*48, yIndex*48) );
      } else if (square === "Y") {
        blocks.push( new Block (xIndex*48, yIndex*48, "middle") );
      }
    });
  });
};

module.exports = Zone;

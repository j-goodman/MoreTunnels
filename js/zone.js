var Block = require("./objects/block.js");

var Zone = function (blueprint) {
  this.blueprint = blueprint;
};

Zone.prototype.build = function (blocks) {
  this.blueprint.forEach(function (yLine, yIndex) {
    yLine.split("").forEach(function (square, xIndex) {
      if (square === "X") {
        blocks.push( new Block (xIndex*48, yIndex*48) );
      }
    });
  });
};

module.exports = Zone;

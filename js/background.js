var Tile = require("./objects/tile.js");

var Background = function (blueprint, spriteKey) {
  this.blueprint = blueprint;
  this.spriteKey = spriteKey;
};

Background.prototype.build = function (tiles) {
  this.blueprint.forEach(function (yLine, yIndex) {
    yLine.split("").forEach(function (square, xIndex) {
      if (this.spriteKey[square]) {
        tiles.push( new Tile (xIndex*48, yIndex*48, this.spriteKey[square].sprite, this.spriteKey[square].depth) );
      }
    }.bind(this));
  }.bind(this));
};

module.exports = Background;

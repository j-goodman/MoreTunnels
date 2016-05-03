var Tile = require("./objects/tile.js");

var Background = function (blueprint, spriteKey) {
  this.blueprint = blueprint;
  this.spriteKey = spriteKey;
};

Background.prototype.build = function (tiles) {
  this.blueprint.forEach(function (yLine, yIndex) {
    yLine.split("").forEach(function (square, xIndex) {
      if (this.spriteKey[square]) {
        if (this.spriteKey[square].length) {
          this.spriteKey[square].forEach(function (sprite) {
            tiles.push( new Tile (xIndex*48, yIndex*48, sprite) );
          });
        } else {
          tiles.push( new Tile (xIndex*48, yIndex*48, this.spriteKey[square]) );
        }
      }
    }.bind(this));
  }.bind(this));
};

module.exports = Background;

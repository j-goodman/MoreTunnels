var Sprite = require('../sprite.js');

var Tile = function (x, y, sprite, depth) {
  this.pos = {
    x: x,
    y: y
  };
  this.depth = depth;
  this.sprite = sprite;
};

module.exports = Tile;

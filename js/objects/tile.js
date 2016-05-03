var Sprite = require('../sprite.js');

var Tile = function (x, y, sprite) {
  this.pos = {
    x: x,
    y: y
  };
  this.width = this.width;
  this.height = this.height;
  this.sprite = sprite;
};

module.exports = Tile;

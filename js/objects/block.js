var Sprite = require('../sprite.js');

var Block = function (x, y) {
  this.pos = {
    x: x,
    y: y
  };
};

Block.prototype.sprite = new Sprite(48, 48, 0, ["blocks/platform_surface.gif"]);

module.exports = Block;

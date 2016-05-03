var Sprite = require('../sprite.js');

var Block = function (x, y, type) {
  this.pos = {
    x: x,
    y: y
  };
  this.type = type;
  this.setSprite();
};

Block.prototype.setSprite = function () {
  var typeLookUp = {
    "top": "blocks/platform_top.gif",
    "middle": "blocks/platform_middle.gif",
    "bolted_hang": "blocks/platform_surface_bolt.gif",
    "hanging": "blocks/platform_surface.gif"
  };
  if (!this.type) {
    this.type = "top";
  }
  this.sprite = new Sprite(48, 48, 0, [typeLookUp[this.type]]);
};

module.exports = Block;

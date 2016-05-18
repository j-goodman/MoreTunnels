var Sprite = require('../sprite.js');

var Meter = function (x, y, health) {
  this.pos = {
    x: x,
    y: y
  };
  this.depth = 1;
  this.virtual = true;
  this.sprite = new Sprite (48, 48, 0, ["tile/up_key.gif"]);
};

module.exports = Meter;

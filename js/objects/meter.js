var Sprite = require('../sprite.js');

var Meter = function (x, y, health) {
  this.pos = {
    x: x,
    y: y
  };
  this.depth = 1;
  this.isMeter = true;
  this.sprite = new Sprite (48, 48, 0, ["meter/"+health+".gif"]);
};

module.exports = Meter;

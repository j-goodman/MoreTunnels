var Sprite = require('../sprite.js');

var MetaBlock = function (x, y, types) {
  this.pos = {
    x: x,
    y: y
  };
  this.types = types;
};

module.exports = MetaBlock;

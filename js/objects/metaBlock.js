var Sprite = require('../sprite.js');
var metaBlocks = require('../objectArrays/metaBlocks.js');

var MetaBlock = function (index, x, y, types) {
  this.index = index;
  this.pos = {
    x: x,
    y: y
  };
  this.types = types;
};

MetaBlock.prototype.destroy = function () {
  delete metaBlocks[this.index];
};

module.exports = MetaBlock;

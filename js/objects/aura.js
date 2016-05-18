var Sprite = require('../sprite.js');
var Util = require('../util/util.js');
var blocks = require('../objectArrays/blocks.js');
var movers = require('../objectArrays/movers.js');
var players = require('../objectArrays/players.js');

var Aura = function (index, subjectPos, color) {
  this.type = "aura";
  this.index = index;
  this.pos = subjectPos;
  this.color = color;
  this.setSprites();
  this.age = 0;
};

Aura.prototype.act = function () {

};

Aura.prototype.destroy = function () {
  delete movers[this.index];
};

Aura.prototype.move = function () {

};

Aura.prototype.setSprites = function () {
  this.sprite = new Sprite (48, 48, 0, [
      "auras/" + this.color + "/0.gif",
      "auras/" + this.color + "/1.gif",
      "auras/" + this.color + "/2.gif",
      "auras/" + this.color + "/3.gif",
    ]
  );
};

module.exports = Aura;

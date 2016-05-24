var Sprite = require('../sprite.js');
var Util = require('../util/util.js');
var Jumpman = require('./jumpman.js');
var Explosion = require('./explosion.js');
var blocks = require('../objectArrays/blocks.js');
var movers = require('../objectArrays/movers.js');
var players = require('../objectArrays/players.js');

var Firebomb = function (index, x, y, xspeed, yspeed) {
  this.type = "firebomb";
  this.index = index;

  this.spriteSize = 48;

  this.pos = {
    x: x,
    y: y
  };
  this.speed = {
    x: xspeed,
    y: yspeed
  };
  this.accel = {
    x: 0,
    y: Util.universals.gravity
  };
  this.setSprites();
};

Firebomb.prototype.act = function () {
  if (this.checkUnderFeet()) {
    this.explode();
  }
};

Firebomb.prototype.checkUnderFeet = Jumpman.prototype.checkUnderFeet;

Firebomb.prototype.explode = function () {
  movers[this.index] = new Explosion (this.index, this.pos.x - 48, this.pos.y - 80);
};

Firebomb.prototype.move = function () {
  this.speed.x += this.accel.x;
  this.speed.y += this.accel.y;
  this.pos.x += this.speed.x;
  this.pos.y += this.speed.y;
};

Firebomb.prototype.setSprites = function () {
  this.sprite = new Sprite (48, 48, 5, [
      "madbomber/bombs/firebomb/thrown/0.gif",
      "madbomber/bombs/firebomb/thrown/1.gif",
      "madbomber/bombs/firebomb/thrown/2.gif",
      "madbomber/bombs/firebomb/thrown/3.gif",
      "madbomber/bombs/firebomb/thrown/4.gif",
      "madbomber/bombs/firebomb/thrown/5.gif",
      "madbomber/bombs/firebomb/thrown/6.gif",
      "madbomber/bombs/firebomb/thrown/7.gif"
    ]
  );
};

module.exports = Firebomb;

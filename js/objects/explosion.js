var Sprite = require('../sprite.js');
var Util = require('../util/util.js');
var Aura = require('./aura.js');
var blocks = require('../objectArrays/blocks.js');
var movers = require('../objectArrays/movers.js');
var players = require('../objectArrays/players.js');

var Explosion = function (index, x, y) {
  this.type = "fireball";
  this.index = index;
  this.age = 0;
  this.radius = 86;
  this.spriteSize = 48;
  this.pos = {
    x: x,
    y: y
  };
  this.setSprites();
  this.age = 0;
  this.center = {
    x: this.pos.x + this.sprite.width/2,
    y: this.pos.y + this.sprite.height
  };
  this.checkForPlayer();
};

Explosion.prototype.act = function () {
  this.checkForMovers();
};

Explosion.prototype.checkForPlayer = function () {
  players.forEach(function (player) {
    if (Util.distanceBetween(this.center, {
      x: player.pos.x + player.sprite.width/2,
      y: player.pos.y + player.sprite.height
    }) < this.radius) {
      player.explosionBite(this);
    }
  }.bind(this));
};

Explosion.prototype.checkForMovers = function () {
  movers.forEach(function (mover) {
    if (Util.distanceBetween(this.center, {
      x: mover.pos.x + mover.sprite.width/2,
      y: mover.pos.y + mover.sprite.height
    }) < this.radius) {
      switch (mover.type) {
        case "skeleton":
          mover.shatter();
        break;
        case "wizard":
          mover.shatter();
        break;
        case "pigeon":
          mover.transmogrify();
        break;
        case "burningman":
          mover.shatter();
        break;
        case "madbomber":
          mover.getBlasted(this);
        break;
      }
    }
  }.bind(this));
};

Explosion.prototype.destroy = function () {
  delete movers[this.index];
};

Explosion.prototype.move = function () {
};

Explosion.prototype.setSprites = function () {
  this.sprite = new Sprite (128, 128, 2, [
      "madbomber/bombs/firebomb/flat_explosion/0.gif",
      "madbomber/bombs/firebomb/flat_explosion/1.gif",
      "madbomber/bombs/firebomb/flat_explosion/2.gif",
      "madbomber/bombs/firebomb/flat_explosion/3.gif",
      "madbomber/bombs/firebomb/flat_explosion/4.gif",
      "madbomber/bombs/firebomb/flat_explosion/5.gif",
      "madbomber/bombs/firebomb/flat_explosion/6.gif",
      "madbomber/bombs/firebomb/flat_explosion/7.gif",
      "madbomber/bombs/firebomb/flat_explosion/8.gif",
      "madbomber/bombs/firebomb/flat_explosion/9.gif"
    ]
  );
  this.sprite.addAnimationEndCallback(function () {
    this.destroy();
  }.bind(this));
};

module.exports = Explosion;

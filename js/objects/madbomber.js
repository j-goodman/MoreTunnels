var Sprite = require('../sprite.js');
var Jumpman = require('./jumpman.js');
var Skeleton = require('./skeleton.js');
var Boneheap = require('./boneheap.js');
var Firebomb = require('./firebomb.js');
var Explosion = require('./explosion.js');
var Util = require('../util/util.js');
var blocks = require('../objectArrays/blocks.js');
var metaBlocks = require('../objectArrays/metaBlocks.js');
var players = require('../objectArrays/players.js');
var movers = require('../objectArrays/movers.js');

var Madbomber = function (index, x, y, stats) {
  this.type = "madbomber";
  this.index = index;
  this.spriteSize = 48;
  this.age = 0;
  this.pos = {
    x: x,
    y: y
  };
  this.speed = {
    x: 0,
    y: 0
  };
  this.accel = {
    x: 0,
    y: Util.universals.gravity
  };
  this.facing = "right";
  this.frame = "right";
  this.spriteRoot = "madbomber";
  this.setSprites(5);
  this.sprite = this.sprites.standing_right;

  if (stats === undefined) {
    this.stats = {
      sightRange: Util.approximately(330),
      runSpeed: Util.approximately(6) + 0.5,
      jumpPower: Util.approximately(12),
      throwPower: Util.approximately(12),
      jumpDistance: 1,
      chasingSkill: Util.approximately(2.5)
    };
  } else {
    this.stats = stats;
  }
  this.throwDistance = this.stats.throwPower*2 / Util.universals.gravity * this.stats.throwPower;
};

Util.inherits(Madbomber, Jumpman);

Madbomber.prototype.act = function () {
  if (Util.distanceBetween(this.pos, players[0].pos) > this.throwDistance) {
    this.chasePlayer();
  } else {
    this.avoidPlayer();
  }
  if (!Math.floor(Math.random()*16) &&
      (Math.abs(Util.distanceBetween(this.pos, players[0].pos) - this.throwDistance)) < 48) {
    this.facing = this.pos.x > players[0].pos.x ? "left" : "right";
    this.speed.x = 0;
    this.throwFireBomb();
  }
  this.checkForHammer();
  this.avoidRoomEdge();
  this.avoidRoomEdge();
  this.dodgeHammer();
  this.checkForJumpBlock();
};

Madbomber.prototype.avoidPlayer = function () {
  if (Math.random()*32 <= this.stats.chasingSkill) {
    Util.xChase(this, players[0].pos, 0-this.stats.runSpeed);
  }
};

Madbomber.prototype.avoidRoomEdge = Skeleton.prototype.avoidRoomEdge;

Madbomber.prototype.chasePlayer = function () {
  if (Math.random()*32 <= this.stats.chasingSkill) {
    Util.xChase(this, players[0].pos, this.stats.runSpeed);
  }
};

Madbomber.prototype.checkForHammer = function () {
  movers.forEach(function (mover) {
    if (mover.type === "hammer" &&
        Util.distanceBetween(this.pos, mover.pos) < this.sprite.height/2 &&
        mover.soft <= 0) {
      mover.ricochet();
      mover.soft = 4;
      this.shatter();
    }
  }.bind(this));
};

Madbomber.prototype.checkForJumpBlock = Skeleton.prototype.checkForJumpBlock;

Madbomber.prototype.dodgeHammer = function () {
  movers.forEach(function (mover) {
    if (mover.type === "hammer" &&
        Math.round(Math.random()*0.75) &&
        Util.distanceBetween(this.pos, mover.pos) > this.stats.sightRange/5 &&
        Util.distanceBetween(this.pos, mover.pos) < this.stats.sightRange/3 ) {
      this.jump();
    }
  }.bind(this));
};

Madbomber.prototype.throwFireBomb = function () {
  movers.push(new Firebomb (
    movers.length,
    this.pos.x,
    this.pos.y,
    this.facing === "right" ? this.stats.throwPower : 0-this.throwPower,
    0-this.stats.throwPower
  ));
};

Madbomber.prototype.jump = function () {
  if (this.checkUnderFeet()) {
    this.speed.y = 0-this.stats.jumpPower;
    this.speed.x *= this.stats.jumpDistance;
  }
};

Madbomber.prototype.setExtraSprites = function () {
};

Madbomber.prototype.shatter = function () {
  movers[this.index] = new Explosion (this.index, this.pos.x - 48, this.pos.y - 80);
};

Madbomber.prototype.wander = function () {
  if (Math.random()*256*(Math.abs(this.speed.x)+0.5) < 1) {
    this.speed.x = this.stats.runSpeed;
  } else if (Math.random()*128 < 2) {
    this.speed.x = 0-this.stats.runSpeed;
  }
};

module.exports = Madbomber;

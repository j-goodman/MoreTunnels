var Sprite = require('../sprite.js');
var Meter = require('./meter.js');
var Jumpman = require('./jumpman.js');
var Util = require('../util/util.js');
var blocks = require('../objectArrays/blocks.js');
var tiles = require('../objectArrays/tiles.js');

var Player = function (x, y) {
  this.pos = {
    x: x,
    y: y
  };
  this.speed = {
    x: 0,
    y: 0
  };
  this.facing = "right";
  this.frame = "right";
  this.accel = {
    x: 0,
    y: 1
  };
  this.spriteRoot = "player";
  this.setSprites(4);
  this.sprite = this.sprites.standing_right;

  // STATS
  this.runSpeed = 6;
  this.jumpPower = 17;
  this.maxHealth = 8;

  this.health = this.maxHealth;
  this.damageRecover = 0;
};

Util.inherits(Player, Jumpman);

Player.prototype.drawData = function (ctx) {
  ctx.font = "12px Courier";
  ctx.strokeText("posX: "+this.pos.x+"("+Math.round(this.pos.x/48)+")", 24, 24);
  ctx.strokeText("posY: "+this.pos.y+"("+Math.round(this.pos.y/48)+")", 24, 36);
  ctx.strokeText("spdX: "+this.speed.x, 24, 48);
  ctx.strokeText("spdY: "+this.speed.y, 24, 60);
  if (this.checkUnderFeet()) {
    ctx.beginPath();
    ctx.arc(98,52,8,0,2*Math.PI);
    ctx.stroke();
  }
};

Player.prototype.drawMeter = function () {
  tiles.push( new Meter (this.pos.x, this.pos.y-64, this.health) );
};

Player.prototype.skeletonBite = function () {
  if (this.damageRecover < 0) {
    this.damageRecover = 64;
    if (this.health <= 8 && this.health > 0) {
      this.health -= 1;
    }
  }
};

module.exports = Player;

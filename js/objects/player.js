var Sprite = require('../sprite.js');
var Meter = require('./meter.js');
var Jumpman = require('./jumpman.js');
var Hammer = require('./hammer.js');
var Util = require('../util/util.js');
var blocks = require('../objectArrays/blocks.js');
var movers = require('../objectArrays/movers.js');
var tiles = require('../objectArrays/tiles.js');

var Player = function (x, y) {
  this.age = 0;
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
    y: Util.universals.gravity
  };
  this.spriteRoot = "hammerman";
  this.setSprites(4);
  this.sprite = this.sprites.standing_right;

  // STATS
  this.runSpeed = 6;
  this.jumpPower = 17;
  this.throwPower = 24;
  this.maxHealth = 8;

  this.hasHammer = true;

  this.health = this.maxHealth;
  this.damageRecover = 0;
  
  this.spriteRoot = "player";
  this.setSprites(4);
  this.spriteRoot = "hammerman";
  this.setSprites(4);
};

Util.inherits(Player, Jumpman);

Player.prototype.drawData = function (ctx) {
  ctx.font = "12px Courier";
  ctx.strokeText("posX: "+this.pos.x+"("+Math.round(this.pos.x/48)+")", 24, 24);
  ctx.strokeText("posY: "+this.pos.y+"("+Math.round(this.pos.y/48)+")", 24, 36);
  ctx.strokeText("spdX: "+this.speed.x, 24, 48);
  ctx.strokeText("spdY: "+this.speed.y, 24, 60);
  ctx.strokeText("hp: "+this.health, 24, 72);
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

Player.prototype.hammerCount = function () {
  increment = 0;
  movers.forEach(function(mover) {
    if (mover && mover.type === "hammer") {
      increment++;
    }
  });
  return increment;
};

Player.prototype.setExtraSprites = function () {
  this.sprites.throwing_right = new Sprite(48, 48, 0, [
    this.spriteRoot+"/right/throw/0.gif",
    this.spriteRoot+"/right/throw/1.gif",
    this.spriteRoot+"/right/throw/2.gif",
    this.spriteRoot+"/right/throw/3.gif",
    this.spriteRoot+"/right/throw/4.gif",
  ]);
  this.sprites.throwing_left = new Sprite(48, 48, 0, [
    this.spriteRoot+"/left/throw/0.gif",
    this.spriteRoot+"/left/throw/1.gif",
    this.spriteRoot+"/left/throw/2.gif",
    this.spriteRoot+"/left/throw/3.gif",
    this.spriteRoot+"/left/throw/4.gif",
  ]);
};

Player.prototype.throwHammer = function () {
  if (this.hammerCount() === 0) {
    movers.push(new Hammer (movers.length, this.pos.x, this.pos.y, (this.facing === "right" ? this.speed.x + this.throwPower : this.speed.x - this.throwPower), this.speed.y));
  }
};

Player.prototype.updateSpriteRoot = function () {
  if (this.hammerCount() === 0) {
    this.spriteRoot = "hammerman";
    this.setSprites(4);
  }
  if (this.hammerCount() !== 0) {
    this.spriteRoot = "player";
    this.setSprites(4);
  }
};

module.exports = Player;

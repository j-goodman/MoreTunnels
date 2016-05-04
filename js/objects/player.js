var Sprite = require('../sprite.js');
var Jumpman = require('./jumpman.js');
var Util = require('../util/util.js');
var blocks = require('../objectArrays/blocks.js');

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
  this.setSprites();
  this.sprite = this.sprites.standing_right;

  // STATS
  this.runSpeed = 6;
  this.jumpPower = 17;
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

module.exports = Player;

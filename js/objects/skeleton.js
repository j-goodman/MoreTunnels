var Sprite = require('../sprite.js');
var Jumpman = require('./jumpman.js');
var Util = require('../util/util.js');
var blocks = require('../objectArrays/blocks.js');
var metaBlocks = require('../objectArrays/metaBlocks.js');
var players = require('../objectArrays/players.js');

var Skeleton = function (x, y) {
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
  this.spriteRoot = "skeleton";
  this.setSprites(5);
  this.sprite = this.sprites.standing_right;

  // STATS
  this.sightRange = 330;
    this.runSpeed = 4;
  this.jumpPower = 18;
  this.chasingSkill = 2.75;
};

Util.inherits(Skeleton, Jumpman);

Skeleton.prototype.determineAction = function () {
  if (this.checkUnderFeet()) {
    while (Math.abs(this.speed.x) > this.runSpeed*1.96) {
      this.speed.x *= 0.92;
    }
    if (Util.distanceBetween(this.pos, players[0].pos) <= this.sightRange) {
      // Chance of giving chase
      if (Math.random()*32 <= this.chasingSkill) {
        Util.xChase(this, players[0].pos, this.runSpeed);
      }
      // If the player is about to escape the skeleton's range, higher chance
      if (Util.distanceBetween(this.pos, players[0].pos) > this.sightRange*0.9) {
        if (Math.random()*32 <= this.chasingSkill*7) {
          Util.xChase(this, players[0].pos, this.runSpeed);
        }
      }
    } else {
      this.wander();
    }
    this.checkForJumpBlock();
    this.checkForPlayer();
  }
};

Skeleton.prototype.wander = function () {
  if (Math.random()*256*(Math.abs(this.speed.x)+0.5) < 1) {
    this.speed.x = this.runSpeed;
  } else if (Math.random()*128 < 2) {
    this.speed.x = 0-this.runSpeed;
  }
};

Skeleton.prototype.checkForJumpBlock = function () {
  metaBlocks.forEach(function(metaBlock){
    if (this.pos.x < metaBlock.pos.x+this.sprite.width+2 &&
        this.pos.x > metaBlock.pos.x-2 &&
        this.pos.y < metaBlock.pos.y+this.sprite.height+2 &&
        this.pos.y > metaBlock.pos.y-2
       ) {
          if (metaBlock.types.includes("jumpRight") &&
            this.speed.x > 0) {
              this.jump();
            }
          if (metaBlock.types.includes("jumpLeft") &&
            this.speed.x < 0) {
              this.jump();
            }
          if (metaBlock.types.includes("switchJumpRight") &&
            this.pos.y-players[0].pos.y > -48 &&
            this.speed.x > 0) {
              this.jump();
            }
          if (metaBlock.types.includes("switchJumpLeft") &&
            this.pos.y-players[0].pos.y > -48 &&
            this.speed.x < 0) {
              this.jump();
            }
          if (metaBlock.types.includes("goLeft")) {
            this.speed.x = Math.abs(this.speed.x)*(-1);
          }
          if (metaBlock.types.includes("goRight")) {
            this.speed.x = Math.abs(this.speed.x);
          }
        }
  }.bind(this));
};

Skeleton.prototype.checkForPlayer = function () {
  players.forEach(function (player) {
    if (this.pos.x < player.pos.x+this.sprite.width+2 &&
      this.pos.x > player.pos.x-2 &&
      this.pos.y < player.pos.y+this.sprite.height+2 &&
      this.pos.y > player.pos.y-2
    ) {
      if (this.checkUnderFeet() && player.checkUnderFeet()) {
        player.skeletonBite();
      }
    }
  }.bind(this));
};

Skeleton.prototype.jump = function () {
  this.speed.y = 0-this.jumpPower;
  this.speed.x *= 1.96;
};

module.exports = Skeleton;

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
  this.setSprites();
  this.sprite = this.sprites.standing_right;

  // STATS
  this.sightRange = 330;
    this.runSpeed = 5;
  this.jumpPower = 18;
  this.chasingSkill = 2.75;
};

Util.inherits(Skeleton, Jumpman);

Skeleton.prototype.determineAction = function () {
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
  }
  this.checkForJumpBlock();
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
              this.speed.y = 0-this.jumpPower;
          }
          if (metaBlock.types.includes("jumpLeft") &&
            this.speed.x < 0) {
              this.speed.y = 0-this.jumpPower;
          }
        }
  }.bind(this));
};

module.exports = Skeleton;

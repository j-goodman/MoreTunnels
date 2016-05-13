var Sprite = require('../sprite.js');
var Jumpman = require('./jumpman.js');
var Boneheap = require('./boneheap.js');
var Util = require('../util/util.js');
var blocks = require('../objectArrays/blocks.js');
var metaBlocks = require('../objectArrays/metaBlocks.js');
var players = require('../objectArrays/players.js');
var movers = require('../objectArrays/movers.js');

var Skeleton = function (index, x, y) {
  this.type = "skeleton";
  this.index = index;
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
  this.spriteRoot = "skeleton";
  this.setSprites(5);
  this.sprite = this.sprites.standing_right;

  // STATS
  this.sightRange = 330;
    this.runSpeed = 5;
  this.jumpPower = 18;
  this.jumpDistance = 1.3;
  this.chasingSkill = 3.5;
};

Util.inherits(Skeleton, Jumpman);

Skeleton.prototype.checkForHammer = function () {
  movers.forEach(function (mover) {
    if (mover.type === "hammer" &&
        Util.distanceBetween(this.pos, mover.pos) < this.sprite.height/2 &&
        mover.soft <= 0) {
      mover.ricochet();
      mover.soft = 8;
      this.shatter();
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
            !(Util.distanceBetween(this.pos, players[0].pos) < this.sightRange &&
            players[0].pos.x < this.pos.x) &&
            this.speed.x > 0) {
              this.jump();
            }
          if (metaBlock.types.includes("switchJumpLeft") &&
            this.pos.y-players[0].pos.y > -48 &&
            !(Util.distanceBetween(this.pos, players[0].pos) < this.sightRange &&
            players[0].pos.x > this.pos.x) &&
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

Skeleton.prototype.determineAction = function () {
  this.facing = (this.speed.x < 0 ? "left" : "right");
  if (this.checkUnderFeet()) {
    while (Math.abs(this.speed.x) > this.runSpeed*this.jumpDistance) {
      this.speed.x *= 0.75;
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
    if (this.age < 12) {
      this.sprite = this.sprites.rising;
    }
    this.checkForJumpBlock();
    this.checkForHammer();
    this.dodgeHammer();
    this.checkForPlayer();
  }
};

Skeleton.prototype.dodgeHammer = function () {
  movers.forEach(function (mover) {
    if (mover.type === "hammer" &&
        Math.round(Math.random()*2) &&
        Util.distanceBetween(this.pos, mover.pos) > this.sightRange/5 &&
        Util.distanceBetween(this.pos, mover.pos) < this.sightRange/3 ) {
      this.jump();
    }
  }.bind(this));
};

Skeleton.prototype.jump = function () {
  if (this.checkUnderFeet()) {
    this.speed.y = 0-this.jumpPower;
    this.speed.x *= this.jumpDistance;
    if (this.pos.x < 48*5 && this.speed.x < 0) {
      this.speed.x *= (-1);
    }
  }
};

Skeleton.prototype.setExtraSprites = function () {
  this.sprites.rising = new Sprite (48, 48, 2, [
      "boneheap/collapsing/3.gif",
      "boneheap/collapsing/2.gif",
      "boneheap/collapsing/1.gif",
      "boneheap/collapsing/0.gif"
    ]
  );
};

Skeleton.prototype.shatter = function () {
  movers[this.index] = new Boneheap (this.index, this.pos);
};

Skeleton.prototype.wander = function () {
  if (Math.random()*256*(Math.abs(this.speed.x)+0.5) < 1) {
    this.speed.x = this.runSpeed;
  } else if (Math.random()*128 < 2) {
    this.speed.x = 0-this.runSpeed;
  }
};

module.exports = Skeleton;

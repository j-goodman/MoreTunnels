var Sprite = require('../sprite.js');
var Jumpman = require('./jumpman.js');
var Boneheap = require('./boneheap.js');
var Util = require('../util/util.js');
var blocks = require('../objectArrays/blocks.js');
var metaBlocks = require('../objectArrays/metaBlocks.js');
var players = require('../objectArrays/players.js');
var movers = require('../objectArrays/movers.js');

var Skeleton = function (index, x, y, stats) {
  this.type = "skeleton";
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
  this.spriteRoot = "skeleton";
  this.setSprites(5);
  this.sprite = this.sprites.standing_right;

  if (stats === undefined) {
    this.stats = {
      sightRange: Util.approximately(330),
      runSpeed: Util.approximately(4),
      jumpPower: Util.approximately(14),
      jumpDistance: Util.approximately(12)/12,
      chasingSkill: Util.approximately(3.5)
    };
  } else {
    this.stats = stats;
  }
};

Util.inherits(Skeleton, Jumpman);

Skeleton.prototype.act = function () {
  this.facing = (this.speed.x < 0 ? "left" : "right");
  if (this.checkUnderFeet()) {
    while (Math.abs(this.speed.x) > this.stats.runSpeed*this.stats.jumpDistance) {
      this.speed.x *= 0.75;
    }
    if (Util.distanceBetween(this.pos, players[0].pos) <= this.stats.sightRange) {
      // Chance of giving chase
      if (Math.random()*32 <= this.stats.chasingSkill) {
        Util.xChase(this, players[0].pos, this.stats.runSpeed);
      }
      // If the player is about to escape the skeleton's range, higher chance
      if (Util.distanceBetween(this.pos, players[0].pos) > this.stats.sightRange*0.9) {
        if (Math.random()*32 <= this.stats.chasingSkill*7) {
          Util.xChase(this, players[0].pos, this.stats.runSpeed);
        }
      }
    } else {
      this.wander();
    }
    if (this.age < 12) {
      this.sprite = this.sprites.rising;
    }
    if (this.speed.y > 100) {
      delete movers[this.index];
    }
    this.checkForJumpBlock();
    this.checkForPlayer();
    this.dodgeHammer();
  }
  this.checkForHammer();
  this.avoidRoomEdge();
};

Skeleton.prototype.checkForHammer = function () {
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

Skeleton.prototype.checkForPlayer = function () {
  players.forEach(function (player) {
    if (this.pos.x < player.pos.x+this.sprite.width &&
      this.pos.x+this.sprite.width > player.pos.x &&
      this.pos.y < player.pos.y+this.sprite.height &&
      this.pos.y+this.sprite.width > player.pos.y
    ) {
      if (this.checkUnderFeet() && player.checkUnderFeet()) {
        // Attack the player, animate if it's succesful
        if (player.skeletonBite()) {
          this.spriteAction = true;
          this.sprite = this.sprites["attack_" + this.facing];
          this.sprite.addAnimationEndCallback(function () {
            this.spriteAction = false;
          }.bind(this));
        }
      }
    }
  }.bind(this));
};

Skeleton.prototype.checkForJumpBlock = function () {
  metaBlocks.forEach(function(metaBlock){
    if (metaBlock && metaBlock.types.includes("horseGate") &&
        Util.distanceBetween(players[0].pos, metaBlock.pos) < 480) {
        metaBlock.destroy();
    }
    if (metaBlock && this.pos.x < metaBlock.pos.x+this.sprite.width+2 &&
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
            !(Util.distanceBetween(this.pos, players[0].pos) < this.stats.sightRange &&
            players[0].pos.x < this.pos.x) &&
            this.speed.x > 0) {
              this.jump();
            }
          if (metaBlock.types.includes("switchJumpLeft") &&
            this.pos.y-players[0].pos.y > -48 &&
            !(Util.distanceBetween(this.pos, players[0].pos) < this.stats.sightRange &&
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
          if (metaBlock.types.includes("horseGate")) {
            this.speed.x = 0;
            this.speed.y = 0;
          }
        }
  }.bind(this));
};

Skeleton.prototype.dodgeHammer = function () {
  movers.forEach(function (mover) {
    if (mover.type === "hammer" &&
        Math.round(Math.random()*0.8) &&
        Util.distanceBetween(this.pos, mover.pos) > this.stats.sightRange/5 &&
        Util.distanceBetween(this.pos, mover.pos) < this.stats.sightRange/3 ) {
      this.jump();
    }
  }.bind(this));
};

Skeleton.prototype.jump = function () {
  if (this.checkUnderFeet()) {
    this.speed.y = 0-this.stats.jumpPower;
    this.speed.x *= this.stats.jumpDistance;
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
  this.sprites.attack_left = new Sprite (48, 48, 2, [
      "skeleton/left/attack/0.gif",
      "skeleton/left/attack/1.gif",
      "skeleton/left/attack/2.gif",
      "skeleton/left/attack/3.gif"
    ]
  );
  this.sprites.attack_right = new Sprite (48, 48, 2, [
      "skeleton/right/attack/0.gif",
      "skeleton/right/attack/1.gif",
      "skeleton/right/attack/2.gif",
      "skeleton/right/attack/3.gif"
    ]
  );
};

Skeleton.prototype.shatter = function () {
  movers[this.index] = new Boneheap (this.index, this.pos, this.stats);
};

Skeleton.prototype.wander = function () {
  if (Math.random()*256*(Math.abs(this.speed.x)+0.5) < 1) {
    this.speed.x = this.stats.runSpeed;
  } else if (Math.random()*128 < 2) {
    this.speed.x = 0-this.stats.runSpeed;
  }
};

module.exports = Skeleton;

var Sprite = require('../sprite.js');
var Jumpman = require('./jumpman.js');
var Boneheap = require('./boneheap.js');
var Skeleton = require('./skeleton.js');
var Pyre = require('./pyre.js');
var Fireball = require('./fireball.js');
var Util = require('../util/util.js');
var blocks = require('../objectArrays/blocks.js');
var metaBlocks = require('../objectArrays/metaBlocks.js');
var players = require('../objectArrays/players.js');
var movers = require('../objectArrays/movers.js');

var Burningman = function (index, x, y, stats) {
  this.type = "burningman";
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
  this.spriteRoot = "burningman";
  this.setSprites(5);
  this.sprite = this.sprites.standing_right;
  this.fireballDelay = 16;

  if (stats === undefined) {
    this.stats = {
      sightRange: Util.approximately(330),
      runSpeed: Util.approximately(4),
      jumpPower: Util.approximately(11),
      jumpDistance: 1,
      chasingSkill: 3,
      throwPower: Util.approximately(9)
    };
  } else {
    this.stats = stats;
  }
};

Util.inherits(Burningman, Jumpman);

Burningman.prototype.act = function () {
  this.checkForHammer();
  this.checkForPlayer();
  this.avoidRoomEdge();
  this.fireballDecision();
  this.jumpAtArcPeak();
  this.dodgeHammer();
  if (!this.pyre && !Math.floor(Math.random()*256) || this.age === 1) {
    this.ignite();
  }
  if (Util.distanceBetween(this.pos, players[0].pos) <= this.stats.sightRange) {
    if (Math.random()*32 <= this.stats.chasingSkill) {
      Util.xChase(this, players[0].pos, this.stats.runSpeed);
    }
  }
  this.checkForJumpBlock();
};

Burningman.prototype.conjureFire = function () {
  if (this.pyre) {
    this.pyre.spriteAction = true;
    this.pyre.sprite = this.pyre.sprites.conjuring;
    this.pyre.sprite.addAnimationEndCallback(function () {
      this.pyre.spriteAction = false;
      this.throwFireball();
    }.bind(this));
  }
};

Burningman.prototype.checkForHammer = function () {
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

Burningman.prototype.checkForPlayer = function () {
  players.forEach(function (player) {
    if (this.pos.x < player.pos.x+this.sprite.width+2 &&
      this.pos.x > player.pos.x-2 &&
      this.pos.y < player.pos.y+this.sprite.height+2 &&
      this.pos.y > player.pos.y-2
    ) {
      if (this.checkUnderFeet() && player.checkUnderFeet()) {
        // Attack the player, reverse your x speed if it's succesful
        if (player.skeletonBite()) {
          this.speed.x *= -1;
        }
      }
    }
  }.bind(this));
};

Burningman.prototype.checkForJumpBlock = Skeleton.prototype.checkForJumpBlock;

Burningman.prototype.dodgeHammer = function () {
  movers.forEach(function (mover) {
    if (mover.type === "hammer" &&
        Math.round(Math.random()*0.8) &&
        Util.distanceBetween(this.pos, mover.pos) > this.stats.sightRange/9 &&
        Util.distanceBetween(this.pos, mover.pos) < this.stats.sightRange/2 ) {
      this.jump();
    }
  }.bind(this));
};

Burningman.prototype.predictPos = function (mover, steps) {
  var predictX = mover.pos.x + mover.speed.x * steps;
  var predictY = mover.pos.y + mover.speed.y * steps;
  return {
    x: predictX,
    y: predictY
  };
};

Burningman.prototype.fireballDecision = function () {
  if (Math.abs(this.predictPos(this, this.fireballDelay).y - this.predictPos(players[0], this.fireballDelay).y) < 48 &&
  Math.abs(this.predictPos(this, this.fireballDelay).x - this.predictPos(players[0], this.fireballDelay).x) < 48*8 &&
  (!Math.floor(Math.random()*48) || !this.checkUnderFeet())) {
    this.conjureFire();
  }
};

Burningman.prototype.fireJump = function () {
  if (this.pyre) {
    this.pyre.spriteAction = true;
    this.pyre.sprite = this.pyre.sprites.jump_burst;
    this.pyre.sprite.addAnimationEndCallback(function () {
      this.pyre.spriteAction = false;
      this.actuallyJump();
    }.bind(this));
  }
};

Burningman.prototype.ignite = function () {
  this.pyre = new Pyre (movers.length, this);
  this.stats.runSpeed = Math.abs(this.stats.runSpeed);
  movers.push(this.pyre);
};

Burningman.prototype.actuallyJump = function () {
  this.speed.y = 0-this.stats.jumpPower;
  this.speed.x *= this.stats.jumpDistance;
};

Burningman.prototype.jumpAtArcPeak = function () {
  if (!this.checkUnderFeet() &&
  Math.abs(this.speed.y) < 1 &&
  this.pos.y > players[0].pos.y-48*2) {
    this.jump();
  }
};

Burningman.prototype.jump = function () {
  if (this.checkUnderFeet()) {
    this.actuallyJump();
  } else {
    this.fireJump();
  }
};

Burningman.prototype.setExtraSprites = function () {
  this.sprites.rising = new Sprite (48, 48, 2, [
      "burningman/boneheap/collapsing/3.gif",
      "burningman/boneheap/collapsing/2.gif",
      "burningman/boneheap/collapsing/1.gif",
      "burningman/boneheap/collapsing/0.gif"
    ]
  );
};

Burningman.prototype.shatter = function () {
  if (this.pyre) {
    this.pyre.destroy();
    this.pyre = null;
    this.stats.runSpeed *= -0.92;
  } else {
    movers[this.index] = new Boneheap (this.index, this.pos, this.stats, "burningman/boneheap");
  }
};

Burningman.prototype.throwFireball = function () {
  if (this.pyre) {
    this.speed.x = 0;
    movers.push(new Fireball (movers.length, this.pos, this.facing ==="right" ? this.stats.throwPower : 0-this.stats.throwPower));
  }
};

Burningman.prototype.wander = function () {
  if (!Math.floor(Math.random()*96) &&
  this.pos.x > Util.universals.roomBottomRight.x/2) {
    this.speed.x = 0-this.runSpeed;
  } else {
    this.speed.x = this.runSpeed;
  }
};

module.exports = Burningman;

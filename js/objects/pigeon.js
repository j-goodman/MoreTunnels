var Sprite = require('../sprite.js');
var Jumpman = require('./jumpman.js');
var Boneheap = require('./boneheap.js');
var Util = require('../util/util.js');
var blocks = require('../objectArrays/blocks.js');
var metaBlocks = require('../objectArrays/metaBlocks.js');
var players = require('../objectArrays/players.js');
var movers = require('../objectArrays/movers.js');

var Pigeon = function (index, x, y) {
  this.type = "pigeon";
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
    y: Util.universals.gravity/2
  };
  this.spriteRoot = "pigeon";
  this.setSprites(1);
  this.sprite = this.sprites.standing_right;

  // STATS
  this.sightRange = 270;
  this.runSpeed = 5;
  this.jumpPower = 6;
  this.spriteRoot = "pigeonwizard";
  this.setSprites(2);
  this.spriteRoot = "wizardpigeon";
  this.setSprites(2);
  this.spriteRoot = "pigeon";
  this.setSprites(2);
};

Util.inherits(Pigeon, Jumpman);

Pigeon.prototype.animateTransformation = function () {
  if (this.age < 2) {
    this.spriteRoot = "pigeonwizard";
    this.setSprites(2);
  } else if (this.age === 4) {
    this.spriteRoot = "wizardpigeon";
    this.setSprites(2);
  } else if (this.age === 22) {
    this.spriteRoot = "pigeon";
    this.setSprites(2);
  }
};

Pigeon.prototype.checkForBoneheap = function () {
  var boneheap = Util.findByType("boneheap", movers);
  var hammer = Util.findByType("hammer", movers);
  if (boneheap && Util.distanceBetween(this.pos, boneheap.pos) < this.sightRange &&
      !(hammer &&
      Util.distanceBetween(this.pos, hammer.pos) > this.sightRange/12 &&
      Util.distanceBetween(this.pos, hammer.pos) < this.sightRange/2 )
    ) {
    this.speed.x = 0;
    this.speed.y = 0;
    this.turnIntoAPerson();
  }
};

Pigeon.prototype.checkForHammer = function () {
  movers.forEach(function (mover) {
    if (mover.type === "hammer" &&
        Util.distanceBetween(this.pos, mover.pos) < this.sprite.height/4 &&
        mover.soft <= 0) {
      mover.ricochet();
      mover.soft = 8;
      this.transmogrify();
    }
  }.bind(this));
};

Pigeon.prototype.determineAction = function () {
  if (players[0].age > 12) {
    this.animateTransformation();
  }
  if (this.speed.y > 3) {
    this.speed.y = 3;
  }
  if (this.pos.y > players[0].pos.y) {
    this.jump();
  }
  if (this.speed.x !== 0 && this.speed.y === 0 && Math.random() > 0.9) {
    this.jump();
  }
  if (Util.typeCount("hammer", movers) === 0 && Util.typeCount("boneheap", movers) === 0) {
    this.wander();
    return;
  }
  if (Util.typeCount("hammer", movers) > 0) {
    var hammer = Util.findByType("hammer", movers);
    if (Util.distanceBetween(this.pos, hammer.pos) < this.sightRange) {
      this.dodgeHammer();
    }
  }
  if (Util.typeCount("boneheap", movers) > 0 && Math.random()*64 < 1) {
    var boneheap = Util.findByType("boneheap", movers);
    this.speed.x = this.pos.x < boneheap.pos.x ? this.runSpeed : 0-this.runSpeed;
  }
  this.checkForHammer();
  this.checkForBoneheap();
};

Pigeon.prototype.dodgeHammer = function () {
  var hammer = Util.findByType("hammer", movers);
  var boneheap = Util.findByType("boneheap", movers);
  this.jump();
  this.speed.x = this.pos.x > hammer.pos.x ? this.runSpeed : 0-this.runSpeed;
  if (boneheap) {
    this.speed.x = this.pos.x < boneheap.pos.x ? this.runSpeed : 0-this.runSpeed;
  }
};

Pigeon.prototype.jump = function () {
  this.speed.y = 0-this.jumpPower;
};

Pigeon.prototype.setExtraSprites = function () {
  this.sprites.jumping_right = this.sprites.running_right;
  this.sprites.jumping_left = this.sprites.running_left;
};

Pigeon.prototype.transmogrify = function () {
  var Wizard = require('./wizard.js');
  movers[this.index] = new Wizard (this.index, this.pos.x, this.pos.y);
};

Pigeon.prototype.turnIntoAPerson = function () {
  if (this.age > 48) {
    this.transmogrify();
  }
};

Pigeon.prototype.wander = function () {
  if (!Math.floor(Math.random()*128)) {
    this.facing = this.facing === "right" ? "left" : "right";
    this.speed.x = 0;
  }
};

module.exports = Pigeon;

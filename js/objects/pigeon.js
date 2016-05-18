var Sprite = require('../sprite.js');
var Jumpman = require('./jumpman.js');
var Boneheap = require('./boneheap.js');
var Util = require('../util/util.js');
var blocks = require('../objectArrays/blocks.js');
var metaBlocks = require('../objectArrays/metaBlocks.js');
var players = require('../objectArrays/players.js');
var movers = require('../objectArrays/movers.js');

var Pigeon = function (index, x, y, stats) {
  this.type = "pigeon";
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
  this.facing = "right";
  this.frame = "right";
  this.accel = {
    x: 0,
    y: Util.universals.gravity/2
  };
  this.spriteRoot = "pigeon";
  this.setSprites(1);
  this.sprite = this.sprites.standing_right;

  if (stats === undefined) {
    this.stats = {
      sightRange: Util.approximately(270),
      runSpeed: Util.approximately(4),
      jumpPower: Util.approximately(18),
      jumpDistance: Util.approximately(1.4),
      chasingSkill: Util.approximately(2),
      magicRange: Util.approximately(72),
      castingDelay: Util.approximately(18)
    };
  } else {
    this.stats = stats;
  }

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
  } else if (this.age === 18) {
    this.spriteRoot = "pigeon";
    this.setSprites(2);
  }
};

Pigeon.prototype.checkForBoneheap = function () {
  var boneheap = Util.findTypeByProx("boneheap", movers, this.pos);
  var hammer = Util.findByType("hammer", movers);
  if (boneheap && Util.distanceBetween(this.pos, boneheap.pos) < this.stats.sightRange &&
      !(hammer &&
      Util.distanceBetween(this.pos, hammer.pos) > this.stats.sightRange/12 &&
      Util.distanceBetween(this.pos, hammer.pos) < this.stats.sightRange/2 )
    ) {
    this.xStop();
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
      this.transmogrify(true);
    }
  }.bind(this));
};

Pigeon.prototype.act = function () {
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
    if (hammer && Util.distanceBetween(this.pos, hammer.pos) < this.stats.sightRange) {
      this.dodgeHammer();
    }
  }
  if (Util.typeCount("boneheap", movers) > 0 && Math.random()*64 < 1) {
    var boneheap = Util.findTypeByProx("boneheap", movers, this.pos);
    Util.xChase(this, boneheap.pos, this.stats.runSpeed);
  }
  this.checkForHammer();
  this.checkForBoneheap();
};

Pigeon.prototype.dodgeHammer = function () {
  var hammer = Util.findByType("hammer", movers);
  var boneheap = Util.findTypeByProx("boneheap", movers, this.pos);
  if (Math.round(Math.random())) {
    this.jump();
  }
  this.speed.x = this.pos.x > hammer.pos.x ? this.stats.runSpeed : 0-this.stats.runSpeed;
  if (boneheap && !Math.round(Math.random()*2)) {
    this.speed.x = this.pos.x < boneheap.pos.x ? this.stats.runSpeed : 0-this.stats.runSpeed;
  }
};

Pigeon.prototype.jump = function () {
  this.speed.y = 0-this.stats.jumpPower/3;
};

Pigeon.prototype.setExtraSprites = function () {
  this.sprites.jumping_right = this.sprites.running_right;
  this.sprites.jumping_left = this.sprites.running_left;
};

Pigeon.prototype.transmogrify = function (kill) {
  var Wizard = require('./wizard.js');
  var wizard = new Wizard (this.index, this.pos.x, this.pos.y, this.stats);
  movers[this.index] = wizard;
  if (kill) {
    wizard.die();
  }
};

Pigeon.prototype.turnIntoAPerson = function () {
  if (this.age > 48) {
    this.transmogrify();
  }
};

Pigeon.prototype.wander = function () {
  if (!Math.floor(Math.random()*128)) {
    this.facing = this.facing === "right" ? "left" : "right";
    this.xStop();
  }
};

module.exports = Pigeon;

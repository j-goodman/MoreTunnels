var Sprite = require('../sprite.js');
var Util = require('../util/util.js');
var Jumpman = require('./jumpman.js');
var blocks = require('../objectArrays/blocks.js');
var movers = require('../objectArrays/movers.js');

var Boneheap = function (index, pos, stats, spriteRoot) {
  this.index = index;
  this.type = "boneheap";
  if (!spriteRoot) {
    this.spriteRoot = "boneheap";
  } else {
    this.spriteRoot = spriteRoot;
  }
  this.age = 0;
  this.pos = {
    x: pos.x,
    y: pos.y
  };
  this.speed = {
    x: 0,
    y: 0
  };
  if (this.speed.y < 0) {
    this.speed.y = 0;
  }
  this.accel = {
    x: 0,
    y: Util.universals.gravity
  };

  if (stats === undefined) {
    this.stats = {
      sightRange: Util.approximately(330),
      runSpeed: Util.approximately(4),
      jumpPower: Util.approximately(14),
      jumpDistance: Util.approximately(1),
      chasingSkill: Util.approximately(3.5)
    };
  } else {
    this.stats = stats;
  }

  this.setSprites();
};

Boneheap.prototype.move = function () {
  this.pos.x += this.speed.x;
  this.pos.y += this.speed.y;
  this.speed.x += this.accel.x;
  this.speed.y += this.accel.y;
  this.landUnderFeet();
};

Boneheap.prototype.act = function () {
  this.age ++;
  if (this.age === this.collapseSprite.frames.length) {
    this.sprite = this.staticSprite;
  }
};

Boneheap.prototype.landUnderFeet = Jumpman.prototype.landUnderFeet;

Boneheap.prototype.landOnGround = Jumpman.prototype.landOnGround;

Boneheap.prototype.reanimate = function () {
  var Skeleton = require('./skeleton.js');
  var Burningman = require('./burningman.js');
  if (this.spriteRoot === "boneheap") {
    movers[this.index] = (new Skeleton (this.index, this.pos.x, this.pos.y, this.stats));
  } else if (this.spriteRoot === "burningman/boneheap") {
    var newBurner = (new Burningman (this.index, this.pos.x, this.pos.y, this.stats));
    movers[this.index] = newBurner;
    newBurner.age = 2;
  }
};

Boneheap.prototype.setSprites = function () {
  this.collapseSprite = new Sprite (48, 48, 0, [
      this.spriteRoot+"/collapsing/0.gif",
      this.spriteRoot+"/collapsing/1.gif",
      this.spriteRoot+"/collapsing/2.gif",
      this.spriteRoot+"/collapsing/3.gif"
    ]
  );
  this.staticSprite = new Sprite (48, 48, 0, [
      this.spriteRoot+"/heap.gif"
    ]
  );
  this.sprite = this.collapseSprite;
};

module.exports = Boneheap;

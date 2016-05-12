var Sprite = require('../sprite.js');
var Util = require('../util/util.js');
var Jumpman = require('./jumpman.js');
var blocks = require('../objectArrays/blocks.js');
var movers = require('../objectArrays/movers.js');

var Boneheap = function (index, pos) {
  this.index = index;
  this.type = "boneheap";
  this.age = 0;
  this.pos = {
    x: pos.x,
    y: pos.y
  };
  this.speed = {
    x: 0,
    y: 0
  };
  this.accel = {
    x: 0,
    y: Util.universals.gravity
  };
  this.setSprites();
};

Boneheap.prototype.move = function () {
  this.pos.x += this.speed.x;
  this.pos.y += this.speed.y;
  this.speed.x += this.accel.x;
  this.speed.y += this.accel.y;
  this.landUnderFeet();
};

Boneheap.prototype.determineAction = function () {
  this.age ++;
  if (this.age === this.collapseSprite.frames.length) {
    this.sprite = this.staticSprite;
  }
};

Boneheap.prototype.landUnderFeet = Jumpman.prototype.landUnderFeet;

Boneheap.prototype.landOnGround = Jumpman.prototype.landOnGround;

Boneheap.prototype.setSprites = function () {
  this.collapseSprite = new Sprite (48, 48, 0, [
      "boneheap/collapsing/0.gif",
      "boneheap/collapsing/1.gif",
      "boneheap/collapsing/2.gif",
      "boneheap/collapsing/3.gif"
    ]
  );
  this.staticSprite = new Sprite (48, 48, 0, [
      "boneheap/heap.gif"
    ]
  );
  this.sprite = this.collapseSprite;
};

module.exports = Boneheap;

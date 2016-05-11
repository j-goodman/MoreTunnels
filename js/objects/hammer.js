var Sprite = require('../sprite.js');
var Util = require('../util/util.js');
var blocks = require('../objectArrays/blocks.js');
var movers = require('../objectArrays/movers.js');
var player = require('../objectArrays/players.js');

var Hammer = function (index, x, y, xspeed, yspeed) {
  this.type = "hammer";
  this.index = index;
  this.attraction = 1;
  this.maxSpeed = 42;
  this.pos = {
    x: x,
    y: y
  };
  this.speed = {
    x: xspeed,
    y: yspeed
  };
  this.accel = {
    x: 0,
    y: 0
  };
  this.setSprites();
};

Hammer.prototype.setSprites = function () {
  this.leftSprite = new Sprite (48, 48, 0, [
      "hammer/left/0.gif",
      "hammer/left/1.gif",
      "hammer/left/2.gif",
      "hammer/left/3.gif",
      "hammer/left/4.gif",
      "hammer/left/5.gif",
      "hammer/left/6.gif",
      "hammer/left/7.gif",
      "hammer/left/8.gif",
      "hammer/left/9.gif",
    ]
  );
  this.rightSprite = new Sprite (48, 48, 0, [
      "hammer/right/0.gif",
      "hammer/right/1.gif",
      "hammer/right/2.gif",
      "hammer/right/3.gif",
      "hammer/right/4.gif",
      "hammer/right/5.gif",
      "hammer/right/6.gif",
      "hammer/right/7.gif",
      "hammer/right/8.gif",
      "hammer/right/9.gif",
    ]
  );
  this.sprite = this.speed.x > 0 ? this.rightSprite : this.leftSprite;
};

Hammer.prototype.move = function () {
  if (Math.abs(this.speed.x) < this.maxSpeed) {
    this.speed.x += this.accel.x;
  }
  if (Math.abs(this.speed.y) < this.maxSpeed) {
    this.speed.y += this.accel.y;
  }
  this.pos.x += this.speed.x;
  this.pos.y += this.speed.y;
};

Hammer.prototype.determineAction = function () {
  this.accel.x = (this.pos.x > players[0].pos.x ?
    -this.attraction : this.attraction);
  this.accel.y = (this.pos.y > players[0].pos.y ?
    -this.attraction : this.attraction);
  this.catchCheck();
};

Hammer.prototype.catchCheck = function () {
  // if (Util.distanceBetween(
  //
  // )) {
  //
  // }
};

Hammer.prototype.destroy = function () {
  movers[this.index].delete();
};

module.exports = Hammer;

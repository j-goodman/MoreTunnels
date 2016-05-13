var Sprite = require('../sprite.js');
var Util = require('../util/util.js');
var blocks = require('../objectArrays/blocks.js');
var movers = require('../objectArrays/movers.js');
var players = require('../objectArrays/players.js');

var Hammer = function (index, x, y, xspeed, yspeed) {
  this.type = "hammer";
  this.index = index;
  this.attraction = 1.8;
  this.maxSpeed = 16;
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
  this.age = 0;
  this.soft = 2;
};

Hammer.prototype.catchCheck = function () {
  if (Util.distanceBetween(
    {
      x: this.pos.x+(this.sprite.width/2),
      y: this.pos.y+(this.sprite.height/2)
    },
    {
      x: players[0].pos.x+(players[0].sprite.width/2),
      y: players[0].pos.y+(players[0].sprite.height/2)
    }
  ) < players[0].sprite.height) {
    this.destroy();
    players[0].updateSpriteRoot();
  }
};

Hammer.prototype.destroy = function () {
  if (this.age > 16) {
    delete movers[this.index];
  }
};

Hammer.prototype.determineAction = function () {
  this.accel.x = (this.pos.x > players[0].pos.x ?
    -this.attraction : this.attraction);
  this.accel.y = (this.pos.y > players[0].pos.y ?
    -this.attraction : this.attraction);
  this.catchCheck();
  this.age ++;
  if (this.soft > 0) {
    this.soft --;
  }
  if (Util.distanceBetween(this.pos, players[0].pos) > 48*10) {
    this.speed = Util.moveTowards(this.pos, players[0].pos, this.maxSpeed);
  }
};

Hammer.prototype.move = function () {
  this.speed.x += this.accel.x;
  this.speed.y += this.accel.y;
  if (Math.abs(this.speed.x) <= this.maxSpeed) {
    this.pos.x += this.speed.x;
  } else {
    this.pos.x += this.speed.x > 0 ? this.maxSpeed : 0-this.maxSpeed;
  }

  if (Math.abs(this.speed.y) <= this.maxSpeed/2) {
    this.pos.y += this.speed.y;
  } else {
    this.pos.y += this.speed.y > 0 ? this.maxSpeed/2 : 0-this.maxSpeed/2;
  }
};

Hammer.prototype.ricochet = function () {
  this.speed.x *= (-1);
  this.speed.y *= (-1);
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

module.exports = Hammer;

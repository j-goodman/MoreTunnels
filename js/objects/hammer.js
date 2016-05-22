var Sprite = require('../sprite.js');
var Util = require('../util/util.js');
var Aura = require('./aura.js');
var blocks = require('../objectArrays/blocks.js');
var movers = require('../objectArrays/movers.js');
var players = require('../objectArrays/players.js');

var Hammer = function (index, x, y, xspeed, yspeed, throwPower) {
  this.type = "hammer";
  this.index = index;

  // constants
  this.FUDGE = 5;
  this.MAXSPEED = 30;
  this.DECAY = 0.1;
  this.BASESPEED = 24;

  this.attraction = 1.8;
  this.spriteSize = 48;

  this.pos = {
    x: x,
    y: y
  };
  this.speed = {
    x: (xspeed + (this.BASESPEED * throwPower)),
    y: yspeed
  };
  this.accel = {
    x: 0,
    y: 0
  };
  this.setSprites();
  this.age = 0;
  this.soft = 2;
  this.hexed = false;
  this.aura = null;

};

Hammer.prototype.act = function () {
  var xGap = this.pos.x - players[0].pos.x;
  var yGap = this.pos.y - players[0].pos.y;
  var distance = Math.sqrt((xGap * xGap) + (yGap * yGap));

  this.accel.x = -(xGap * (this.attraction + (this.age * this.DECAY))) / distance;
  this.accel.y = -(yGap * (this.attraction + (this.age * 2 * this.DECAY))) / distance;

  this.catchCheck();
  this.age ++;
  if (this.soft > 0) {
    this.soft --;
  }
  if (Util.distanceBetween(this.pos, players[0].pos) > 48*10) {
    this.speed = Util.moveTowards(this.pos, players[0].pos, this.MAXSPEED);
  }
  this.checkForHexes();
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
  ) < players[0].sprite.height + this.FUDGE) {
    this.destroy();
    players[0].updateSpriteRoot();
  }
};

Hammer.prototype.checkForHexes = function () {
  if (this.hexed) {
    if (this.attraction < 1.8) {
      this.attraction += 0.05;
    } else {
      this.hexed = false;
      this.aura.destroy();
      this.haywire();
    }
  }
};

Hammer.prototype.destroy = function () {
  if (this.aura) {
    this.aura.destroy();
  }
  if (this.age > 16) {
    delete movers[this.index];
  }
};

Hammer.prototype.haywire = function () {
  this.speed.x = (Math.random() * this.maxSpeed * 2) - this.maxSpeed;
  this.speed.y = (Math.random() * this.maxSpeed * 2) - this.maxSpeed;
};

Hammer.prototype.hex = function () {
  this.attraction = -4;
  this.speed.y = 0;
  this.speed.x = 0;
  this.hexed = true;
  this.aura = new Aura (movers.length, this.pos, "pinkish");
  movers.push(this.aura);
};

Hammer.prototype.limitSpeed = function () {
  var speed = Math.sqrt((this.speed.x * this.speed.x) + (this.speed.y * this.speed.y));
  if (speed > this.MAXSPEED){
    var ratio = (this.MAXSPEED / speed);
    this.speed.x *= ratio;
    this.speed.y *= ratio;
  }
};

Hammer.prototype.move = function () {
  this.speed.x += this.accel.x;
  this.speed.y += this.accel.y;

  this.limitSpeed();

  this.pos.x += this.speed.x;
  this.pos.y += this.speed.y;
};

Hammer.prototype.ricochet = function () {
  this.speed.x *= (-0.7);
  this.speed.y *= (-0.7);
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

var Sprite = require('../sprite.js');
var Util = require('../util/util.js');
var Aura = require('./aura.js');
var blocks = require('../objectArrays/blocks.js');
var movers = require('../objectArrays/movers.js');
var players = require('../objectArrays/players.js');

var Fireball = function (index, pos, xspeed) {
  this.type = "fireball";
  this.index = index;
  this.age = 0;
  this.spriteSize = 48;
  this.pos = Object.assign( {}, pos);
  this.pos.y = Math.round(this.pos.y/48) * 48;
  this.speed = {
    x: xspeed,
    y: 0
  };
  this.setSprites();
  this.age = 0;
};

Fireball.prototype.act = function () {
  this.checkForPlayer();
  this.age ++;
  if (this.age > 64) {
    this.burst();
  }
};

Fireball.prototype.burst = function () {
  this.sprite = this.sprites.pop;
  this.sprite.addAnimationEndCallback(function () {
    this.destroy();
  }.bind(this));
};

Fireball.prototype.checkForPlayer = function () {
  players.forEach(function (player) {
    if (this.pos.x < player.pos.x+this.sprite.width+2 &&
      this.pos.x > player.pos.x-2 &&
      this.pos.y < player.pos.y+this.sprite.height+2 &&
      this.pos.y > player.pos.y-2
    ) {
      player.fireballBite();
      this.burst();
    }
  }.bind(this));
};

Fireball.prototype.destroy = function () {
  delete movers[this.index];
};

Fireball.prototype.move = function () {
  this.pos.x += this.speed.x;
  this.pos.y += this.speed.y;
};

Fireball.prototype.ricochet = function () {
  this.speed.x *= (-1);
  this.speed.y *= (-1);
};

Fireball.prototype.setSprites = function () {
  this.sprites = {};
  this.sprites.leftSprite = new Sprite (48, 48, 1, [
      "burningman/fireball/left/0.gif",
      "burningman/fireball/left/1.gif",
      "burningman/fireball/left/2.gif",
      "burningman/fireball/left/3.gif",
      "burningman/fireball/left/4.gif",
      "burningman/fireball/left/5.gif",
      "burningman/fireball/left/6.gif"
    ]
  );
  this.sprites.rightSprite = new Sprite (48, 48, 1, [
      "burningman/fireball/right/0.gif",
      "burningman/fireball/right/1.gif",
      "burningman/fireball/right/2.gif",
      "burningman/fireball/right/3.gif",
      "burningman/fireball/right/4.gif",
      "burningman/fireball/right/5.gif",
      "burningman/fireball/right/6.gif"
    ]
  );
  this.sprites.pop = new Sprite (48, 48, 1, [
      "burningman/fireball/pop/0.gif",
      "burningman/fireball/pop/1.gif",
      "burningman/fireball/pop/2.gif",
      "burningman/fireball/pop/3.gif"
    ]
  );
  this.sprite = this.speed.x > 0 ? this.sprites.rightSprite : this.sprites.leftSprite;
};

module.exports = Fireball;

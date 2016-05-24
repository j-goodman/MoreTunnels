var Sprite = require('../sprite.js');
var Meter = require('./meter.js');
var Jumpman = require('./jumpman.js');
var Hammer = require('./hammer.js');
var Util = require('../util/util.js');
var UpKey = require('./upKey.js');
var blocks = require('../objectArrays/blocks.js');
var movers = require('../objectArrays/movers.js');
var tiles = require('../objectArrays/tiles.js');
var overlays = require('../objectArrays/overlays.js');

var Player = function (index, x, y) {
  this.age = 0;
  this.index = index;
  this.type = "player";
  this.spriteSize = 48;
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
    y: Util.universals.gravity
  };
  this.spriteRoot = "hammerman";
  this.setSprites(4);
  this.sprite = this.sprites.standing_right;

  // STATS
  this.stats = {
    runSpeed: 6,
    jumpPower: 17,
    throwPower: 1,
    maxHealth: 8
  };

  this.hasHammer = true;

  this.dead = false;
  this.health = this.stats.maxHealth;
  this.healthHundredth = 100;
  this.status = "normal";
  this.damageRecover = 0;

  // this.spriteRoot = "player";
  // this.setSprites(4);
  // this.spriteRoot = "hammerman";
  // this.setSprites(4);
};

Util.inherits(Player, Jumpman);

Player.prototype.checkIfDead = function () {
  if (this.health <= 0 && !this.dead) {
    this.sprite = this.sprites["falling_" + this.facing];
    this.sprite.addAnimationEndCallback(function () {
      this.sprite = this.sprites["dead_" + this.facing];
      this.updateSprite = function () {};
      this.drawMeter = function () {};
      this.dead = true;
    }.bind(this));
    this.xStop();
  }
};

Player.prototype.drawData = function (ctx) {
  ctx.font = "12px Courier";
  ctx.strokeText("posX: "+this.pos.x+"("+Math.round(this.pos.x/48)+")", 24, 24);
  ctx.strokeText("posY: "+this.pos.y+"("+Math.round(this.pos.y/48)+")", 24, 36);
  ctx.strokeText("spdX: "+this.speed.x, 24, 48);
  ctx.strokeText("spdY: "+this.speed.y, 24, 60);
  ctx.strokeText("hp: "+this.health, 24, 72);
  if (this.checkUnderFeet()) {
    ctx.beginPath();
    ctx.arc(98,52,8,0,2*Math.PI);
    ctx.stroke();
  }
};

Player.prototype.drawUpKey = function () {
  overlays.push( new UpKey (this.pos.x, this.pos.y-64) );
};

Player.prototype.drawMeter = function () {
  overlays.push( new Meter (this.pos.x, this.pos.y-64, this.health) );
};

Player.prototype.enterSubway = function (subway) {
  this.speed.x = 0;
  this.speed.y = 0;
  this.invisible = true;
  this.onSubway = subway;
};

Player.prototype.move = function () {
  this.age++;
  this.upKeyAux = null;
  this.pos.x += this.speed.x;
  this.pos.y += this.speed.y;
  this.speed.x += this.accel.x;
  this.speed.y += this.accel.y;
  this.updateSprite();
  this.checkCollisions();
  if (typeof this.damageRecover !== "undefined") {
    this.damageRecover -= 1;
    if (this.damageRecover > 0) {
      this.drawMeter();
    }
  }
  if (this.onSubway) {
    this.pos.x += Math.round(this.onSubway.speed.x*1.25);
  }
  this.checkIfDead();
  Util.ironWalls(this);
};

Player.prototype.skeletonBite = function () {
  if (this.damageRecover < 0) {
    this.damageRecover = 64;
    if (this.health <= 8 && this.health > 0) {
      this.health -= 1;
      return true;
    }
  }
};

Player.prototype.fireballBite = Player.prototype.skeletonBite;

Player.prototype.shoggothBite = function (shoggoth) {
  if (this.damageRecover < 0) {
    this.damageRecover = 64;
    if (this.health <= 8 && this.health > 0) {
      this.health -= 1;
      this.jump();
      this.speed.x = this.pos.x < shoggoth.pos.x ? 0-this.stats.runSpeed : this.stats.runSpeed;
      this.speed.y *= 0.65;
    }
  }
};

Player.prototype.explosionBite = function (explosion) {
  if (this.damageRecover < 0) {
    this.damageRecover = 64;
    if (this.health <= 8 && this.health > 0) {
      this.health -= 2;
      this.speed.x = this.pos.x+this.sprite.width/2 < explosion.center.x ? 0-this.stats.runSpeed*1.5 : this.stats.runSpeed*1.5;
      this.jump();
      this.speed.y *= 1.25;
      this.xStop();
    }
    if (this.health < 0) {
      this.health = 0;
    }
  }
};

Player.prototype.shogBeamBite = function () {
  if (this.damageRecover < 0) {
    this.damageRecover = 64;
    if (this.health <= 8 && this.health > 1) {
      this.health -= 2;
    } else if (this.health === 1) {
      this.health = 0;
    }
  }
};

Player.prototype.hammerCount = function () {
  increment = 0;
  movers.forEach(function(mover) {
    if (mover && mover.type === "hammer") {
      increment++;
    }
  });
  return increment;
};

Player.prototype.jump = function () {
  this.speed.y = 0-this.stats.jumpPower;
};

Player.prototype.setExtraSprites = function () {
  this.sprites.throwing_right = new Sprite(48, 48, 0, [
    this.spriteRoot+"/right/throw/0.gif",
    this.spriteRoot+"/right/throw/1.gif",
    this.spriteRoot+"/right/throw/2.gif",
    this.spriteRoot+"/right/throw/3.gif",
    this.spriteRoot+"/right/throw/4.gif",
  ]);
  this.sprites.throwing_left = new Sprite(48, 48, 0, [
    this.spriteRoot+"/left/throw/0.gif",
    this.spriteRoot+"/left/throw/1.gif",
    this.spriteRoot+"/left/throw/2.gif",
    this.spriteRoot+"/left/throw/3.gif",
    this.spriteRoot+"/left/throw/4.gif",
  ]);
  this.sprites.dead_right = new Sprite(this.spriteSize, this.spriteSize, 0, ["playerfall/right/dead.gif"]);
  this.sprites.dead_left = new Sprite(this.spriteSize, this.spriteSize, 0, ["playerfall/left/dead.gif"]);
  this.sprites.falling_right = new Sprite(this.spriteSize, this.spriteSize, 4, [
    "playerfall/right/dying/0.gif",
    "playerfall/right/dying/1.gif",
    "playerfall/right/dying/2.gif",
    "playerfall/right/dying/3.gif"
  ]);
  this.sprites.falling_left = new Sprite(this.spriteSize, this.spriteSize, 4, [
    "playerfall/left/dying/0.gif",
    "playerfall/left/dying/1.gif",
    "playerfall/left/dying/2.gif",
    "playerfall/left/dying/3.gif"
  ]);
};

Player.prototype.throwHammer = function () {
  if (this.hammerCount() === 0 && !this.dead) {
    movers.push(new Hammer (movers.length, this.pos.x, this.pos.y, this.speed.x, this.speed.y, (this.facing === "right" ? this.stats.throwPower : -this.stats.throwPower)));
  }
};

Player.prototype.updateSpriteRoot = function () {
  if (this.hammerCount() === 0) {
    this.spriteRoot = "hammerman";
    this.setSprites(4);
  }
  if (this.hammerCount() !== 0) {
    this.spriteRoot = "player";
    this.setSprites(4);
  }
};

Player.prototype.upKey = function () {
  if (this.upKeyAux) {
    this.upKeyAux();
  } else {
    this.jump();
  }
};

Player.prototype.upKeyAux = null;

module.exports = Player;

var Sprite = require('../sprite.js');
var Jumpman = require('./jumpman.js');
var Boneheap = require('./boneheap.js');
var Util = require('../util/util.js');
var Sparks = require('./sparks.js');
var blocks = require('../objectArrays/blocks.js');
var metaBlocks = require('../objectArrays/metaBlocks.js');
var players = require('../objectArrays/players.js');
var movers = require('../objectArrays/movers.js');

var Shoggoth = function (index, x, y, stats) {
  this.type = "shoggoth";
  this.index = index;
  this.spriteSize = 72;
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
  this.facing = "left";
  this.spriteRoot = "shoggoth";
  this.setSprites(3);
  this.casting = 0;
  this.scared = 0;
  this.sprite = this.sprites.standing_left;
  this.blind = false;

  if (stats === undefined) {
    this.startingRunSpeed = Util.approximately(2);
    this.stats = {
      sightRange: Util.approximately(420),
      runSpeed: this.startingRunSpeed,
      jumpPower: Util.approximately(4),
      castingRange: Util.approximately(420),
      castingEndurance: Util.approximately(72),
      chasingSkill: Util.approximately(3.5),
      shieldRange: 48*4,
    };
  } else {
    this.stats = stats;
  }
};

Util.inherits(Shoggoth, Jumpman);

Shoggoth.prototype.act = function () {
  this.watchForHammer();
  this.checkForHammer();
  this.checkForPlayer();
  if (this.casting > 0) {
    this.casting --;
  }
  if (this.scared > 0) {
    this.scared --;
  }
  if (this.scared === 1) {
    this.stats.runSpeed = this.startingRunSpeed;
  }
  if (this.scared && this.sparks) {
    this.sparks.destroy();
  }
  if (!this.blind && !this.casting && Math.random()*32 <= this.stats.chasingSkill) {
    Util.xChase(this, players[0].pos, this.stats.runSpeed);
  }
  if (Util.distanceBetween(this.spriteCenter(), players[0].spriteCenter()) < this.stats.castingRange &&
      !this.blind &&
      !this.scared &&
      !this.casting &&
      Math.random()*32 <= this.stats.chasingSkill/8) {
    this.closeEye();
  }
  this.updateSprite();
  this.avoidRoomEdge();
};

Shoggoth.prototype.cast = function () {
  this.speed.x = 0;
  this.casting = 96;
  var sparksPos = {
    x: this.facing === "left" ? this.pos.x - 48 : this.pos.x + 48,
    y: this.pos.y + 12
  };
  this.sparks = new Sparks(movers.length, sparksPos, this);
  movers.push(this.sparks);
};

Shoggoth.prototype.closeEye = function () {
  this.speed.x = 0;
  this.facing = this.pos.x > players[0].pos.x ? "left" : "right";
  this.blind = true;
  this.sprite = this.sprites["shuttingEye_" + this.facing];
  this.sprite.addAnimationEndCallback(function () {
    this.sprite = this.sprites.casting;
    this.cast();
    this.blind = false;
  }.bind(this));
};

Shoggoth.prototype.checkForHammer = function () {
  movers.forEach(function (mover) {
    if (mover.type === "hammer" &&
        mover.pos.x >= this.pos.x &&
        mover.pos.x <= this.pos.x + this.spriteSize &&
        mover.pos.y >= this.pos.y &&
        mover.pos.y <= this.pos.y + this.spriteSize &&
        !mover.soft
        ) {
      mover.ricochet();
      mover.soft = 8;
      if (this.scared) {
        this.die();
      } else {
        this.panic();
      }
    }
  }.bind(this));
};

Shoggoth.prototype.checkForPlayer = function () {
  var player = players[0];
  if (player.pos.x + player.spriteSize >= this.pos.x &&
      player.pos.x <= this.pos.x + this.spriteSize &&
      player.pos.y + player.spriteSize >= this.pos.y &&
      player.pos.y <= this.pos.y + this.spriteSize &&
      player.checkUnderFeet() &&
      this.checkUnderFeet()
      ) {
    if (!Math.round(Math.random(16)))
    player.shoggothBite();
  }
};

Shoggoth.prototype.destroy = function () {
  delete movers[this.index];
};

Shoggoth.prototype.die = function () {
  this.updateSprite = function () {};
  this.checkForPlayer = function () {};
  this.speed.x = 0;
  this.sprite = this.sprites["shrivel_"+this.facing];
  this.sprite.addAnimationEndCallback(function () {
    this.destroy();
  }.bind(this));
};

Shoggoth.prototype.drawBeamToHammer = function (hammer) {
  var ctx = Util.universals.canvasContext;
  var view = Util.universals.view.topLeftPos;
  ctx.strokeStyle = "white";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(this.eyePos("standing").x-view.x, this.eyePos("standing").y-view.y);
  ctx.lineTo(hammer.pos.x+hammer.spriteSize/2-view.x, hammer.pos.y+hammer.spriteSize/2-view.y);
  ctx.stroke();
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
};

Shoggoth.prototype.eyePos = function (pose) {
  if (!pose) {
    return {
      x: this.facing === "left" ? this.pos.x + 7 : this.pos.x + this.spriteSize - 7,
      y: this.pos.y + 18
    };
  } else if (pose === "standing") {
    return {
      x: this.facing === "left" ? this.pos.x + 18 : this.pos.x + this.spriteSize - 18,
      y: this.pos.y + 16
    };
  }
};

Shoggoth.prototype.panic = function () {
  this.scared = 32*5;
  this.casting = 0;
  this.stats.runSpeed = -6.5;
  // runSpeed is negative so chase logic makes the Shoggoth run away
};

Shoggoth.prototype.setExtraSprites = function () {
  this.sprites.shuttingEye_left = new Sprite (72, 72, 3, [
    "shoggoth/left/shuttingEye/0.gif",
    "shoggoth/left/shuttingEye/1.gif",
    "shoggoth/left/shuttingEye/2.gif",
    "shoggoth/left/shuttingEye/3.gif",
    ]
  );
  this.sprites.shuttingEye_right = new Sprite (72, 72, 3, [
    "shoggoth/right/shuttingEye/0.gif",
    "shoggoth/right/shuttingEye/1.gif",
    "shoggoth/right/shuttingEye/2.gif",
    "shoggoth/right/shuttingEye/3.gif",
    ]
  );
  this.sprites.casting_left = new Sprite (72, 72, 4, [
    "shoggoth/left/casting/0.gif",
    "shoggoth/left/casting/1.gif",
    "shoggoth/left/casting/2.gif",
    "shoggoth/left/casting/3.gif",
    "shoggoth/left/casting/4.gif",
    "shoggoth/left/casting/5.gif",
    "shoggoth/left/casting/6.gif",
    "shoggoth/left/casting/7.gif",
    "shoggoth/left/casting/8.gif",
    "shoggoth/left/casting/9.gif"
    ]
  );
  this.sprites.casting_right = new Sprite (72, 72, 4, [
    "shoggoth/right/casting/0.gif",
    "shoggoth/right/casting/1.gif",
    "shoggoth/right/casting/2.gif",
    "shoggoth/right/casting/3.gif",
    "shoggoth/right/casting/4.gif",
    "shoggoth/right/casting/5.gif",
    "shoggoth/right/casting/6.gif",
    "shoggoth/right/casting/7.gif",
    "shoggoth/right/casting/8.gif",
    "shoggoth/right/casting/9.gif"
    ]
  );
  this.sprites.scared_right = new Sprite (72, 72, 2, [
    "shoggoth/right/scared/0.gif",
    "shoggoth/right/scared/1.gif",
    "shoggoth/right/scared/2.gif",
    "shoggoth/right/scared/3.gif",
    "shoggoth/right/scared/4.gif",
    "shoggoth/right/scared/5.gif",
    ]
  );
  this.sprites.scared_left = new Sprite (72, 72, 2, [
    "shoggoth/left/scared/0.gif",
    "shoggoth/left/scared/1.gif",
    "shoggoth/left/scared/2.gif",
    "shoggoth/left/scared/3.gif",
    "shoggoth/left/scared/4.gif",
    "shoggoth/left/scared/5.gif",
    ]
  );
  this.sprites.shrivel_left = new Sprite (72, 72, 5, [
    "shoggoth/left/shrivel/0.gif",
    "shoggoth/left/shrivel/1.gif",
    "shoggoth/left/shrivel/2.gif",
    "shoggoth/left/shrivel/3.gif",
    "shoggoth/left/shrivel/4.gif",
    "shoggoth/left/shrivel/5.gif",
    "shoggoth/left/shrivel/6.gif",
    "shoggoth/left/shrivel/7.gif",
    "shoggoth/left/shrivel/8.gif",
    ]
  );
  this.sprites.shrivel_right = new Sprite (72, 72, 5, [
    "shoggoth/right/shrivel/0.gif",
    "shoggoth/right/shrivel/1.gif",
    "shoggoth/right/shrivel/2.gif",
    "shoggoth/right/shrivel/3.gif",
    "shoggoth/right/shrivel/4.gif",
    "shoggoth/right/shrivel/5.gif",
    "shoggoth/right/shrivel/6.gif",
    "shoggoth/right/shrivel/7.gif",
    "shoggoth/right/shrivel/8.gif",
    ]
  );
};

Shoggoth.prototype.updateSprite = function () {
  if (this.sprite === this.sprites.shuttingEye_left ||
      this.sprite === this.sprites.shuttingEye_right) {
    return;
  }
  if (this.speed.x > 0) {
    this.sprite = this.sprites.running_right;
    this.facing = "right";
  } else if (this.speed.x < 0) {
    this.sprite = this.sprites.running_left;
    this.facing = "left";
  } else {
    this.sprite = this.sprites["standing_" + this.facing];
  }
  if (this.casting) {
    this.sprite = this.sprites["casting_" + this.facing];
  }
  if (this.scared) {
    this.sprite = this.sprites["scared_" + this.facing];
  }
};

Shoggoth.prototype.wander = function () {
  if (Math.random()*256*(Math.abs(this.speed.x)+0.5) < 1) {
    this.speed.x = this.stats.runSpeed;
  } else if (Math.random()*128 < 2) {
    this.speed.x = 0-this.stats.runSpeed;
  }
};

Shoggoth.prototype.watchForHammer = function () {
  movers.forEach(function (mover) {
    if (mover.type === "hammer" &&
      !this.blind &&
      !this.casting &&
      !this.scared &&
      !mover.soft
    ) {
      if (Util.distanceBetween(this.spriteCenter(), mover.pos) < this.stats.shieldRange) {
        mover.soft = 8;
        mover.ricochet();
        mover.speed.x *= 0.8;
        mover.speed.y -= 24;
        mover.speed.y *= 1.6;
      }
      if (
      Util.distanceBetween(this.spriteCenter(), mover.pos) < this.stats.shieldRange * 1.5
      ) {
        this.drawBeamToHammer(mover);
      }
    }
  }.bind(this));
};

module.exports = Shoggoth;

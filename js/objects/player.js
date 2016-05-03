var Sprite = require('../sprite.js');
var blocks = require('../objectArrays/blocks.js');

var Player = function (x, y) {
  this.pos = {
    x: x,
    y: y
  };
};

Player.prototype.runSpeed = 6;
Player.prototype.jumpPower = 17;

Player.prototype.facing = "right";

Player.prototype.frame = "right";

Player.prototype.speed = {
  x: 0,
  y: 0
};

Player.prototype.accel = {
  x: 0,
  y: 1
};

Player.prototype.sprites = {
  standing_right: new Sprite(48, 48, 0, ["player/right/standing.gif"]),
  jumping_right: new Sprite(48, 48, 0, ["player/right/jumping.gif"]),
  standing_left: new Sprite(48, 48, 0, ["player/left/standing.gif"]),
  jumping_left: new Sprite(48, 48, 0, ["player/left/jumping.gif"]),
  running_right: new Sprite(48, 48, 4, [
    "player/right/running/0.gif",
    "player/right/running/1.gif",
    "player/right/running/2.gif",
    "player/right/running/3.gif"
  ]),
  running_left: new Sprite(48, 48, 4, [
    "player/left/running/0.gif",
    "player/left/running/1.gif",
    "player/left/running/2.gif",
    "player/left/running/3.gif"
  ])
};

Player.prototype.sprite = Player.prototype.sprites.running_right;

Player.prototype.move = function () {
  this.pos.x += this.speed.x;
  this.pos.y += this.speed.y;
  this.speed.x += this.accel.x;
  this.speed.y += this.accel.y;
  this.updateSprite();
  this.landUnderFeet();
};

Player.prototype.landUnderFeet = function () {
  var returnVal = false;
  blocks.forEach(function (block) {
    if (this.pos.x > block.pos.x - block.sprite.width &&
        this.pos.x < block.pos.x + block.sprite.width &&
        this.pos.y+this.sprite.height > block.pos.y-1 &&
        this.pos.y+this.sprite.height < block.pos.y+block.sprite.height)
    {
      if (this.speed.y >= 0) {
        returnVal = true;
        this.landOnGround(block);
      }
    }
  }.bind(this));
  return returnVal;
};

Player.prototype.checkUnderFeet = function () {
  var returnVal = false;
  blocks.forEach(function (block) {
    if (this.pos.x > block.pos.x - block.sprite.width &&
        this.pos.x < block.pos.x + block.sprite.width &&
        this.pos.y+this.sprite.height > block.pos.y-1 &&
        this.pos.y+this.sprite.height < block.pos.y+block.sprite.height)
    {
      if (this.speed.y >= 0) {
        returnVal = true;
      }
    }
  }.bind(this));
  return returnVal;
};

Player.prototype.landOnGround = function (block) {
  if (this.speed.y > -1) {
    this.speed.y = 0;
  }
  this.pos.y = block.pos.y-this.sprite.height;
};

Player.prototype.updateSprite = function () {
  if (this.speed.x === 0) {
    if (this.facing === "left") {
      this.sprite = this.sprites.standing_left;
    } else {
      this.sprite = this.sprites.standing_right;
    }
  } else if (this.speed.x > 0) {
    this.sprite = this.sprites.running_right;
  } else if (this.speed.x < 0) {
    this.sprite = this.sprites.running_left;
  } if (!this.checkUnderFeet()) {
    if (this.facing === "left") {
      this.sprite = this.sprites.jumping_left;
    } else {
      this.sprite = this.sprites.jumping_right;
    }
  }
};

Player.prototype.xStop = function () {
  if (this.pos.x%48===0) {
    this.speed.x = 0;
  } else {
    setTimeout(this.xStop.bind(this), 16);
  }
};

Player.prototype.drawData = function (ctx) {
  ctx.font = "12px Courier";
  ctx.strokeText("posX: "+this.pos.x+"("+Math.round(this.pos.x/48)+")", 12, 12);
  ctx.strokeText("posY: "+this.pos.y+"("+Math.round(this.pos.y/48)+")", 12, 24);
  ctx.strokeText("spdX: "+this.speed.x, 12, 36);
  ctx.strokeText("spdY: "+this.speed.y, 12, 48);
};

module.exports = Player;

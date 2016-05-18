var Sprite = require('../sprite.js');
var Util = require('../util/util.js');
var blocks = require('../objectArrays/blocks.js');

var Jumpman = function () {
};

Jumpman.prototype.avoidRoomEdge = function () {
  if (this.checkUnderFeet()) {
    if (this.pos.x < Math.abs(this.stats.runSpeed) * 20) {
      this.speed.x = Math.abs(this.stats.runSpeed);
    } else if (this.pos.x > Util.universals.roomBottomRight.x - Math.abs(this.stats.runSpeed * 20)) {
      this.speed.x = 0-Math.abs(this.stats.runSpeed);
    }
  }
};

Jumpman.prototype.move = function () {
  this.age++;
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
};

Jumpman.prototype.checkCollisions = function () {
  this.landUnderFeet();
};

Jumpman.prototype.landUnderFeet = function () {
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

Jumpman.prototype.setSprites = function (delay) {
  this.sprites = {
    standing_right: new Sprite(this.spriteSize, this.spriteSize, 0, [this.spriteRoot+"/right/standing.gif"]),
    jumping_right: new Sprite(this.spriteSize, this.spriteSize, 0, [this.spriteRoot+"/right/jumping.gif"]),
    standing_left: new Sprite(this.spriteSize, this.spriteSize, 0, [this.spriteRoot+"/left/standing.gif"]),
    jumping_left: new Sprite(this.spriteSize, this.spriteSize, 0, [this.spriteRoot+"/left/jumping.gif"]),
    running_right: new Sprite(this.spriteSize, this.spriteSize, delay, [
      this.spriteRoot+"/right/running/0.gif",
      this.spriteRoot+"/right/running/1.gif",
      this.spriteRoot+"/right/running/2.gif",
      this.spriteRoot+"/right/running/3.gif"
    ]),
    running_left: new Sprite(this.spriteSize, this.spriteSize, delay, [
      this.spriteRoot+"/left/running/0.gif",
      this.spriteRoot+"/left/running/1.gif",
      this.spriteRoot+"/left/running/2.gif",
      this.spriteRoot+"/left/running/3.gif"
    ])
  };
  if (this.setExtraSprites) {
    this.setExtraSprites();
  }
};

Jumpman.prototype.checkUnderFeet = function () {
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

Jumpman.prototype.landOnGround = function (block) {
  if (this.speed.y > -1) {
    this.speed.y = 0;
  }
  this.pos.y = block.pos.y-this.sprite.height;
};

Jumpman.prototype.checkSides = function () {
  var returnVal = "none";
  blocks.forEach(function (block) {
    if (this.pos.y+this.sprite.height > block.pos.y &&
        this.pos.y+this.sprite.height < block.pos.y+block.sprite.height) {
          if (this.pos.x+50 >= block.pos.x &&
              this.pos.x+46 <= block.pos.x &&
            this.speed.x > 0) {
            returnVal = "right";
          }
          if (this.pos.x-50 <= block.pos.x &&
              this.pos.x-46 >= block.pos.x &&
            this.speed.x < 0) {
            returnVal = "left";
          }
        }
  }.bind(this));
  return returnVal;
};

Jumpman.prototype.spriteCenter = function () {
  return {
    x: this.pos.x + this.sprite.width/2,
    y: this.pos.y + this.sprite.height/2
  };
};

Jumpman.prototype.updateSprite = function () {
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

Jumpman.prototype.xStop = function () {
  if (this.speed.x > 0) {
    this.xRightStop();
  } else {
    this.xLeftStop();
  }
};

Jumpman.prototype.xRightStop = function () {
  if (this.pos.x%24===0 && this.checkUnderFeet()) {
    this.speed.x = 0;
  } else {
    if (this.speed.x > 0) {
      setTimeout(this.xRightStop.bind(this), 16);
    }
  }
};

Jumpman.prototype.xLeftStop = function () {
  if (this.pos.x%24===0 && this.checkUnderFeet()) {
    this.speed.x = 0;
  } else {
    if (this.speed.x < 0) {
      setTimeout(this.xLeftStop.bind(this), 16);
    }
  }
};

Jumpman.prototype.drawData = function (ctx) {
  ctx.font = "12px Courier";
  ctx.strokeText("posX: "+this.pos.x+"("+Math.round(this.pos.x/48)+")", 24, 24);
  ctx.strokeText("posY: "+this.pos.y+"("+Math.round(this.pos.y/48)+")", 24, 36);
  ctx.strokeText("spdX: "+this.speed.x, 24, 48);
  ctx.strokeText("spdY: "+this.speed.y, 24, 60);
  if (this.checkUnderFeet()) {
    ctx.beginPath();
    ctx.arc(98,52,8,0,2*Math.PI);
    ctx.stroke();
  }
};

module.exports = Jumpman;

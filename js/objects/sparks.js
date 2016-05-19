var Sprite = require('../sprite.js');
var Util = require('../util/util.js');
var Jumpman = require('./jumpman.js');
var blocks = require('../objectArrays/blocks.js');
var movers = require('../objectArrays/movers.js');
var players = require('../objectArrays/players.js');

var Sparks = function (index, pos, shoggoth) {
  this.type = "sparks";
  this.index = index;
  this.spriteSize = 48;
  this.shoggoth = shoggoth;
  this.pos = pos;
  this.speed = {
    x: 0,
    y: 0
  };
  this.accel = {
    x: this.shoggoth.facing === "left" ? -0.18 : 0.18,
    y: 1
  };
  this.setSprites();
  this.age = 0;
};

Sparks.prototype.landUnderFeet = Jumpman.prototype.landUnderFeet;
Sparks.prototype.landOnGround = Jumpman.prototype.landOnGround;

Sparks.prototype.checkLine = function (array) {
  if (this.shoggoth.facing === "right") {
    array.forEach(function (element) {
      if (element &&
        element.pos.x + element.spriteSize > this.shoggoth.eyePos().x &&
        element.pos.x < this.pos.x &&
        element.pos.y + element.spriteSize > this.shoggoth.eyePos().y &&
        element.pos.y < this.pos.y + this.spriteSize) {
          if (element.type === "player") {
            element.shogBeamBite();
          } else if (element.type === "skeleton") {
            element.shatter();
          } else if (element.type === "pigeon") {
            element.transmogrify();
          } else if (element.type === "wizard") {
            element.die();
          }
        }
      }.bind(this));
  } else {
    array.forEach(function (element) {
      if (element &&
        this.shoggoth.eyePos().x > element.pos.x &&
        this.pos.x < element.pos.x + element.spriteSize &&
        this.shoggoth.eyePos().y < element.pos.y + element.spriteSize &&
        this.pos.y + this.spriteSize > element.pos.y) {
          if (element.type === "player") {
            element.shogBeamBite();
          } else if (element.type === "skeleton") {
            element.shatter();
          } else if (element.type === "pigeon") {
            element.transmogrify();
          } else if (element.type === "wizard") {
            element.die();
          }
        }
      }.bind(this));
  }
};

Sparks.prototype.act = function () {
  if (!this.shoggoth.casting) {
    this.destroy();
  }
};

Sparks.prototype.destroy = function () {
  delete movers[this.index];
};

Sparks.prototype.drawBeam = function () {
  var ctx = Util.universals.canvasContext;
  var view = Util.universals.view.topLeftPos;
  ctx.strokeStyle = "white";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(this.shoggoth.eyePos().x-view.x, this.shoggoth.eyePos().y-view.y);
  ctx.lineTo(this.pos.x+this.spriteSize/2-view.x, this.pos.y+this.spriteSize-view.y);
  ctx.stroke();
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
};

Sparks.prototype.move = function () {
  this.age++;
  this.pos.x += this.speed.x;
  this.pos.y += this.speed.y;
  this.speed.x += this.accel.x;
  this.speed.y += this.accel.y;
  this.landUnderFeet();
  if (this.shoggoth.casting) {
    this.drawBeam();
    this.checkLine(movers);
    this.checkLine(players);
  }
  Util.ironWalls(this);
};

Sparks.prototype.setSprites = function () {
  this.sprite = new Sprite(this.spriteSize, this.spriteSize, 1, [
    "beam/sparks/0.gif",
    "beam/sparks/1.gif",
    "beam/sparks/2.gif",
    "beam/sparks/3.gif",
    "beam/sparks/4.gif",
    "beam/sparks/5.gif",
    "beam/sparks/6.gif"
  ]);
};

module.exports = Sparks;

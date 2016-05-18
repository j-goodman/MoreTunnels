var Util = require('../../util/util.js');
var Sprite = require('../../sprite.js');
var Doors = require('./doors.js');

var A = function (index, carType, x, y, xSpeed, xAccel) {
  this.index = index;
  this.type = "aCar";
  this.spriteHeight = 100;
  this.spriteWidth = 240;
  this.carType = carType;
  this.entering = true;
  this.pos = {
    x: x,
    y: y
  };
  this.speed = {
    x: xSpeed,
    y: 0
  };
  this.accel = {
    x: xAccel,
    y: 0
  };
  this.doors = null;
  this.setSprites();
};

A.prototype.move = function () {
  this.speed.x += this.accel.x;
  this.speed.y += this.accel.y;
  if (this.entering && this.speed.x < 0) {
    this.speed.x = 0;
  }
  this.pos.x += this.speed.x;
  this.pos.y += this.speed.y;
};

A.prototype.act = function () {
  if (this.speed.x === 0 && Util.typeCount("doors", trains) <= Util.typeCount("aCar", trains)) {
    trains.push(new Doors (trains.length, this.pos));
  }
};

A.prototype.setSprites = function () {
  switch (this.carType) {
    case "front":
      this.sprite = new Sprite (this.spriteWidth, this.spriteHeight, 0, ["trains/A/cars/front.gif"]);
    break;
    case "middle":
      this.sprite = new Sprite (this.spriteWidth, this.spriteHeight, 0, ["trains/A/cars/middle.gif"]);
    break;
    case "rear":
      this.sprite = new Sprite (this.spriteWidth, this.spriteHeight, 0, ["trains/A/cars/rear.gif"]);
    break;
  }
};

module.exports = A;

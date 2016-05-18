var Util = require('../../util/util.js');
var Figure = require('../../figure.js');

var A = function (index, x, y, xSpeed, xAccel) {
  this.index = index;
  this.type = "aTrain";
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
  this.setSprites();
};

A.prototype.move = function () {
  this.pos.x += this.speed.x;
  this.pos.y += this.speed.y;
  this.speed.x += this.accel.x;
  this.speed.y += this.accel.y;
};

A.prototype.act = function () {

};

A.prototype.setSprites = function () {
  this.sprite = new Figure ();
};

module.exports = A;

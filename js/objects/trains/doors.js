var Util = require('../../util/util.js');
var Sprite = require('../../sprite.js');
var players = require('../../objectArrays/players.js');
var trains = require('../../objectArrays/trains.js');

var Doors = function (index, pos, train) {
  this.index = index;
  this.type = "doors";
  this.spriteHeight = 100;
  this.spriteWidth = 240;
  this.pos = pos;
  this.train = train;
  this.setSprites();
};

Doors.prototype.move = function () {};

Doors.prototype.act = function () {
  this.checkForPlayer();
};

Doors.prototype.checkForPlayer = function () {
  if (
      (
      //Left Door
      players[0].pos.x + players[0].spriteSize > this.pos.x + 24 &&
      players[0].pos.x < this.pos.x + 58 &&
      players[0].pos.y > this.pos.y) ||
      (
      //Right Door
      players[0].pos.x + players[0].spriteSize > this.pos.x + 186 &&
      players[0].pos.x < this.pos.x + 220 &&
      players[0].pos.y > this.pos.y)
      ) {
        players[0].drawUpKey();
        players[0].upKeyAux = function () {
          players[0].enterSubway(this.train);
          this.train.conductor.departTrains();
        }.bind(this);
      }
};

Doors.prototype.close = function () {
  this.sprite = this.sprites.closing;
  this.sprite.addAnimationEndCallback(function () {
    this.train.accel.x = 0.1;
    this.destroy();
  }.bind(this));
};

Doors.prototype.destroy = function () {
  delete trains[this.index];
};

Doors.prototype.setSprites = function () {
  this.sprites = {};
  this.sprites.opening = new Sprite (this.spriteWidth, this.spriteHeight, 1,
    [
      "trains/A/cars/doorsOpening/0.gif",
      "trains/A/cars/doorsOpening/1.gif",
      "trains/A/cars/doorsOpening/2.gif",
      "trains/A/cars/doorsOpening/3.gif"
    ]
  );
  this.sprites.closing = new Sprite (this.spriteWidth, this.spriteHeight, 1,
    [
      "trains/A/cars/doorsOpening/3.gif",
      "trains/A/cars/doorsOpening/2.gif",
      "trains/A/cars/doorsOpening/1.gif",
      "trains/A/cars/doorsOpening/0.gif"
    ]
  );
  this.sprites.open = new Sprite (this.spriteWidth, this.spriteHeight, 0, ["trains/A/cars/openDoors.gif"]);
  this.sprite = this.sprites.opening;
  this.sprite.addAnimationEndCallback(function () {
    this.sprite = this.sprites.open;
  }.bind(this));
};

module.exports = Doors;

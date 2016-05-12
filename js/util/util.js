var Util = {
  universals: {
    gravity: 1
  },
};

Util.inherits = function (ChildClass, BaseClass) {
  function Surrogate() { this.constructor = ChildClass; }
  Surrogate.prototype = BaseClass.prototype;
  ChildClass.prototype = new Surrogate();
};

Util.distanceBetween = function (firstPos, secondPos) {
  xGap = Math.abs(firstPos.x - secondPos.x);
  yGap = Math.abs(firstPos.y - secondPos.y);
  return(Math.sqrt(xGap*xGap+yGap*yGap));
};

Util.direction = function (xSpeed, ySpeed) {
  return Math.atan(ySpeed/xSpeed);
};

Util.moveTowards = function (moverPos, targetPos, vectorSpeed) {
  var xSpeed = ((moverPos.x - targetPos.x)/(Math.sqrt(
    Math.pow((moverPos.x - targetPos.x), 2) + Math.pow((moverPos.y - targetPos.y), 2)
  )*vectorSpeed));
  var ySpeed = ((moverPos.y - targetPos.y)/(Math.sqrt(
    Math.pow((moverPos.x - targetPos.x), 2) + Math.pow((moverPos.y - targetPos.y), 2)
  )*vectorSpeed));
  return {
    x: xSpeed,
    y: ySpeed
  };
};

Util.xChase = function (chaser, targetPos, speed) {
  if (chaser.pos.x > players[0].pos.x) {
    chaser.speed.x = 0-speed;
  } else if (chaser.pos.x < players[0].pos.x) {
    chaser.speed.x = speed;
  }
};

module.exports = Util;

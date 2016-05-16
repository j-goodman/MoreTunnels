var Util = {
  universals: {
    gravity: 1
  },
};

Array.prototype.mean = function () {
  var sum = 0;
  for (var i = 0; i < this.length; i++) {
    sum += this[i];
  }
  return sum/this.length;
};

Util.inherits = function (ChildClass, BaseClass) {
  function Surrogate() { this.constructor = ChildClass; }
  Surrogate.prototype = BaseClass.prototype;
  ChildClass.prototype = new Surrogate();
};

Util.approximately = function (integers, normFactor, middleInt) {
  if (typeof integers !== "object") {
    integers = [integers];
  }
  if (typeof normFactor === "undefined") {
    normFactor = 7;
  }
  if (typeof middleInt === "undefined") {
    middleInt = integers[0];
  }

  integers[integers.length-1] = integers[integers.length-1] + Math.random()*integers[integers.length-1] - Math.random()*integers[integers.length-1];

  if (integers.length === normFactor) {
    return Math.ceil(integers.mean());
  } else {
    integers.push(middleInt);
    return Util.approximately(integers, normFactor, middleInt);
  }
};

Util.distanceBetween = function (firstPos, secondPos) {
  xGap = Math.abs(firstPos.x - secondPos.x);
  yGap = Math.abs(firstPos.y - secondPos.y);
  return(Math.sqrt(xGap*xGap+yGap*yGap));
};

Util.direction = function (xSpeed, ySpeed) {
  return Math.atan(ySpeed/xSpeed);
};

Util.findByType = function (type, array) {
  var result;
  array.forEach(function (mover) {
    if (mover.type && mover.type === type) {
      result = mover;
    }
  });
  return result;
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

Util.typeCount = function (type, array) {
  var increment = 0;
  array.forEach(function (mover) {
    if (mover.type && mover.type === type) {
      increment ++;
    }
  });
  return increment;
};

Util.xChase = function (chaser, targetPos, speed) {
  if (chaser.pos.x > targetPos.x) {
    chaser.speed.x = 0-speed;
  } else if (chaser.pos.x < targetPos.x) {
    chaser.speed.x = speed;
  }
};

module.exports = Util;

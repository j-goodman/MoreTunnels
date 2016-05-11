var Util = {

  universals: {
    gravity: 1
  },

  inherits: function (ChildClass, BaseClass) {
    function Surrogate() { this.constructor = ChildClass; }
    Surrogate.prototype = BaseClass.prototype;
    ChildClass.prototype = new Surrogate();
  },

  distanceBetween: function (firstPos, secondPos) {
    xGap = Math.abs(firstPos.x - secondPos.x);
    yGap = Math.abs(firstPos.y - secondPos.y);
    return(Math.sqrt(xGap*xGap+yGap*yGap));
  },

  direction: function (xSpeed, ySpeed) {
    return Math.atan(ySpeed/xSpeed);
  },

  xChase: function (chaser, targetPos, speed) {
    if (chaser.pos.x > players[0].pos.x) {
      chaser.speed.x = 0-speed;
    } else if (chaser.pos.x < players[0].pos.x) {
      chaser.speed.x = speed;
    }
  }
};

module.exports = Util;

var View = function (topLeftX, topLeftY, bottomRightX, bottomRightY) {
  this.topLeftPos = {x: topLeftX, y: topLeftY};
  this.width = bottomRightX-topLeftX;
  this.height = bottomRightY-topLeftY;
};

View.prototype.recenter = function (centerPos) {
  this.topLeftPos.x = centerPos.x-this.width/2;
  this.topLeftPos.y = centerPos.y-this.height/2;
};

module.exports = View;

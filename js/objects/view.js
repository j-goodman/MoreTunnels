var View = function (topLeftX, topLeftY, bottomRightX, bottomRightY, maxX, maxY) {
  this.topLeftPos = {x: topLeftX, y: topLeftY};
  this.width = bottomRightX-topLeftX;
  this.height = bottomRightY-topLeftY;
  this.maxX = maxX;
  this.maxY = maxY;
};

View.prototype.recenter = function (centerPos) {
  this.topLeftPos.x = centerPos.x-this.width/2;
  if (this.topLeftPos.x+this.width > this.maxX) {
    this.topLeftPos.x = this.maxX-this.width;
  }
  if (this.topLeftPos.y+this.height > this.maxY) {
    this.topLeftPos.y = this.maxY-this.height;
  }
  if (this.topLeftPos.x < 0) {
    this.topLeftPos.x = 0;
  }
  if (this.topLeftPos.y < 0) {
    this.topLeftPos.y = 0;
  }
};

module.exports = View;

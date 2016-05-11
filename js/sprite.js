var Sprite = function (width, height, frameDelay, sourcePathArray) {
  this.frames = [];
  this.width = width;
  this.height = height;
  this.frameDelay = 0;
  this.frameDelayMax = frameDelay;
  this.angle = 0;
  sourcePathArray.forEach(function(path, index){
    this.frames[index] = new Image(width, height);
    this.frames[index].src = "./sprites/"+path;
  }.bind(this));
};

Sprite.prototype.frame = 0;

Sprite.prototype.animate = function () {
  if (this.frames.length > 1) {
    if (this.frameDelay === 0) {
        this.frame++;
        if (this.frame === this.frames.length) {
          this.frame = 0;
        }
    }
    this.frameDelay-=1;
    if (this.frameDelay < 0) {
      this.frameDelay = this.frameDelayMax;
    }
  }
};

Sprite.prototype.draw = function (ctx, pos, viewAnchor) {
  ctx.drawImage(
    this.frames[this.frame],
    pos.x-viewAnchor.x,
    pos.y-viewAnchor.y,
    this.width,
    this.height
  );
  this.animate();
};

Sprite.prototype.depthDraw = function (ctx, pos, viewAnchor, depthFactor) {
  //The depth factor should be a multiple of 0.5 between 1.5 and 5
  ctx.drawImage(
    this.frames[this.frame],
    pos.x-(viewAnchor.x/depthFactor),
    pos.y-(viewAnchor.y/depthFactor),
    this.width,
    this.height
  );
  this.animate();
};

module.exports = Sprite;

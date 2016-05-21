var Sprite = require('../sprite.js');
var Util = require('../util/util.js');
var movers = require('../objectArrays/movers.js');

var Pyre = function (index, source) {
  this.type = "pyre";
  this.index = index;
  this.pos = source.pos;
  this.source = source;
  this.setSprites();
  this.sprite = this.sprites.standing_right;
  this.spriteAction = false;
};

Pyre.prototype.act = function () {
  if (!this.spriteAction) {
    this.sprite = this.sprites["standing_"+this.source.facing];
    if (this.source.speed.x !== 0) {
      this.sprite = this.sprites["running_"+this.source.facing];
    }
    if (this.source.speed.y !== 0) {
      this.sprite = this.sprites["jumping_"+this.source.facing];
    }
  }
};

Pyre.prototype.destroy = function () {
  delete movers[this.index];
};

Pyre.prototype.move = function () {
  this.pos = this.source.pos;
};

Pyre.prototype.setSprites = function () {
  this.sprites = {
    running_right: new Sprite (48, 48, 2, [
        "burningman/rightPyre/running/0.gif",
        "burningman/rightPyre/running/1.gif",
        "burningman/rightPyre/running/2.gif",
        "burningman/rightPyre/running/3.gif"
      ]
    ),
    running_left: new Sprite (48, 48, 2, [
        "burningman/leftPyre/running/0.gif",
        "burningman/leftPyre/running/1.gif",
        "burningman/leftPyre/running/2.gif",
        "burningman/leftPyre/running/3.gif"
      ]
    ),
    jumping_right: new Sprite (48, 48, 2, [
        "burningman/rightPyre/jumping.gif"
      ]
    ),
    jumping_left: new Sprite (48, 48, 2, [
        "burningman/leftPyre/jumping.gif"
      ]
    ),
    standing_right: new Sprite (48, 48, 2, [
        "burningman/rightPyre/standing/0.gif",
        "burningman/rightPyre/standing/1.gif",
        "burningman/rightPyre/standing/2.gif"
      ]
    ),
    standing_left: new Sprite (48, 48, 2, [
        "burningman/leftPyre/standing/0.gif",
        "burningman/leftPyre/standing/1.gif",
        "burningman/leftPyre/standing/2.gif"
      ]
    ),
    jump_burst: new Sprite (48, 48, 1, [
        "burningman/jumpBurst/0.gif",
        "burningman/jumpBurst/1.gif",
        "burningman/jumpBurst/2.gif",
        "burningman/jumpBurst/3.gif",
        "burningman/jumpBurst/4.gif",
        "burningman/jumpBurst/5.gif"
      ]
    ),
    conjuring: new Sprite (48, 48, 4, [
        "burningman/flameBurst/0.gif",
        "burningman/flameBurst/1.gif",
        "burningman/flameBurst/2.gif",
        "burningman/flameBurst/3.gif"
      ]
    )
  };
};

module.exports = Pyre;

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var renderZone = __webpack_require__(1);
	var Player = __webpack_require__(2);
	var Skeleton = __webpack_require__(12);
	var Block = __webpack_require__(15);
	var View = __webpack_require__(16);
	var keyEvents = __webpack_require__(17);
	var blocks = __webpack_require__(6);
	var metaBlocks = __webpack_require__(14);
	var tiles = __webpack_require__(11);
	var movers = __webpack_require__(9);
	var players = __webpack_require__(10);
	
	window.onload = function () {
	  var canvas = document.getElementById("canvas");
	
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	players.push( new Player (8*48, 5*48) );
	keyEvents(document, players[0]);
	
	var zone = __webpack_require__(18);
	zone.build(blocks, movers, metaBlocks);
	
	var backgroundBricks = __webpack_require__(22);
	backgroundBricks.build(tiles);
	
	var backgroundPillars = __webpack_require__(25);
	backgroundPillars.build(tiles, 2);
	backgroundPillars.build(tiles, 3);
	
	var view = new View (0, 0, 640, 480, 55*48, 10*48);
	
	  setInterval(function () {
	    ctx.fillStyle = "turquoise";
	    ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	    tiles.forEach(function(tile, idx){
	      tile.sprite.depthDraw(ctx, tile.pos, view.topLeftPos, tile.depth);
	      if (tile.isMeter) {
	        delete tiles[idx];
	      }
	    });
	
	    blocks.forEach(function(block){
	      block.sprite.draw(ctx, block.pos, view.topLeftPos);
	    });
	
	    movers.forEach(function(mover){
	      mover.sprite.draw(ctx, mover.pos, view.topLeftPos);
	    });
	
	    view.recenter(players[0].pos);
	
	    players[0].sprite.draw(ctx, players[0].pos, view.topLeftPos);
	
	    players[0].drawData(ctx);
	
	    players[0].move();
	    movers.forEach(function(mover){
	      mover.move();
	      mover.determineAction();
	    });
	  }, 32);
	};


/***/ },
/* 1 */
/***/ function(module, exports) {

	// var Player = require('./objects/player.js');
	// var Block = require('./objects/block.js');
	//
	// renderZone = {
	//   build: function (zone, canvas) {
	//     zone.blueprint.forEach(function (string, yIndex) {
	//       for (var xIndex=0; xIndex < string.length; xIndex++) {
	//         switch (string.charAt(xIndex)) {
	//           case "_":
	//             break;
	//           case "X":
	//             zone.objects.push(new Block(xIndex, yIndex));
	//             break;
	//           case "!":
	//             zone.objects.push(new Player(xIndex, yIndex));
	//             break;
	//         }
	//       }
	//     });
	//   }
	// };
	//
	// module.exports = renderZone;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Sprite = __webpack_require__(3);
	var Meter = __webpack_require__(4);
	var Jumpman = __webpack_require__(5);
	var Hammer = __webpack_require__(7);
	var Util = __webpack_require__(8);
	var blocks = __webpack_require__(6);
	var movers = __webpack_require__(9);
	var tiles = __webpack_require__(11);
	
	var Player = function (x, y) {
	  this.age = 0;
	  this.pos = {
	    x: x,
	    y: y
	  };
	  this.speed = {
	    x: 0,
	    y: 0
	  };
	  this.facing = "right";
	  this.frame = "right";
	  this.accel = {
	    x: 0,
	    y: Util.universals.gravity
	  };
	  this.spriteRoot = "hammerman";
	  this.setSprites(4);
	  this.sprite = this.sprites.standing_right;
	
	  // STATS
	  this.runSpeed = 6;
	  this.jumpPower = 17;
	  this.throwPower = 24;
	  this.maxHealth = 8;
	
	  this.hasHammer = true;
	
	  this.health = this.maxHealth;
	  this.damageRecover = 0;
	  this.spriteRoot = "hammerman";
	  this.setSprites(4);
	  this.spriteRoot = "player";
	  this.setSprites(4);
	};
	
	Util.inherits(Player, Jumpman);
	
	Player.prototype.drawData = function (ctx) {
	  ctx.font = "12px Courier";
	  ctx.strokeText("posX: "+this.pos.x+"("+Math.round(this.pos.x/48)+")", 24, 24);
	  ctx.strokeText("posY: "+this.pos.y+"("+Math.round(this.pos.y/48)+")", 24, 36);
	  ctx.strokeText("spdX: "+this.speed.x, 24, 48);
	  ctx.strokeText("spdY: "+this.speed.y, 24, 60);
	  ctx.strokeText("hp: "+this.health, 24, 72);
	  if (this.checkUnderFeet()) {
	    ctx.beginPath();
	    ctx.arc(98,52,8,0,2*Math.PI);
	    ctx.stroke();
	  }
	};
	
	Player.prototype.drawMeter = function () {
	  tiles.push( new Meter (this.pos.x, this.pos.y-64, this.health) );
	};
	
	Player.prototype.skeletonBite = function () {
	  if (this.damageRecover < 0) {
	    this.damageRecover = 64;
	    if (this.health <= 8 && this.health > 0) {
	      this.health -= 1;
	    }
	  }
	};
	
	Player.prototype.hammerCount = function () {
	  increment = 0;
	  movers.forEach(function(mover) {
	    if (mover && mover.type === "hammer") {
	      increment++;
	    }
	  });
	  return increment;
	};
	
	Player.prototype.setExtraSprites = function () {
	  this.sprites.throwing_right = new Sprite(48, 48, 0, [
	    this.spriteRoot+"/right/throw/0.gif",
	    this.spriteRoot+"/right/throw/1.gif",
	    this.spriteRoot+"/right/throw/2.gif",
	    this.spriteRoot+"/right/throw/3.gif",
	    this.spriteRoot+"/right/throw/4.gif",
	  ]);
	  this.sprites.throwing_left = new Sprite(48, 48, 0, [
	    this.spriteRoot+"/left/throw/0.gif",
	    this.spriteRoot+"/left/throw/1.gif",
	    this.spriteRoot+"/left/throw/2.gif",
	    this.spriteRoot+"/left/throw/3.gif",
	    this.spriteRoot+"/left/throw/4.gif",
	  ]);
	};
	
	Player.prototype.throwHammer = function () {
	  if (this.hammerCount() === 0) {
	    movers.push(new Hammer (movers.length, this.pos.x, this.pos.y, (this.facing === "right" ? this.speed.x + this.throwPower : this.speed.x - this.throwPower), this.speed.y));
	  }
	};
	
	Player.prototype.updateSpriteRoot = function () {
	  if (this.hammerCount() === 0) {
	    this.spriteRoot = "hammerman";
	    this.setSprites(4);
	  }
	  if (this.hammerCount() !== 0) {
	    this.spriteRoot = "player";
	    this.setSprites(4);
	  }
	};
	
	module.exports = Player;


/***/ },
/* 3 */
/***/ function(module, exports) {

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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Sprite = __webpack_require__(3);
	
	var Meter = function (x, y, health) {
	  this.pos = {
	    x: x,
	    y: y
	  };
	  this.depth = 1;
	  this.isMeter = true;
	  this.sprite = new Sprite (48, 48, 0, ["meter/"+health+".gif"]);
	};
	
	module.exports = Meter;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Sprite = __webpack_require__(3);
	var blocks = __webpack_require__(6);
	
	var Jumpman = function () {
	};
	
	Jumpman.prototype.move = function () {
	  this.age++;
	  this.pos.x += this.speed.x;
	  this.pos.y += this.speed.y;
	  this.speed.x += this.accel.x;
	  this.speed.y += this.accel.y;
	  this.updateSprite();
	  this.checkCollisions();
	  if (typeof this.damageRecover !== "undefined") {
	    this.damageRecover -= 1;
	    if (this.damageRecover > 0) {
	      this.drawMeter();
	    }
	  }
	};
	
	Jumpman.prototype.checkCollisions = function () {
	  this.landUnderFeet();
	};
	
	Jumpman.prototype.landUnderFeet = function () {
	  var returnVal = false;
	  blocks.forEach(function (block) {
	    if (this.pos.x > block.pos.x - block.sprite.width &&
	        this.pos.x < block.pos.x + block.sprite.width &&
	        this.pos.y+this.sprite.height > block.pos.y-1 &&
	        this.pos.y+this.sprite.height < block.pos.y+block.sprite.height)
	    {
	      if (this.speed.y >= 0) {
	        returnVal = true;
	        this.landOnGround(block);
	      }
	    }
	  }.bind(this));
	  return returnVal;
	};
	
	Jumpman.prototype.setSprites = function (delay) {
	  this.sprites = {
	    standing_right: new Sprite(48, 48, 0, [this.spriteRoot+"/right/standing.gif"]),
	    jumping_right: new Sprite(48, 48, 0, [this.spriteRoot+"/right/jumping.gif"]),
	    standing_left: new Sprite(48, 48, 0, [this.spriteRoot+"/left/standing.gif"]),
	    jumping_left: new Sprite(48, 48, 0, [this.spriteRoot+"/left/jumping.gif"]),
	    running_right: new Sprite(48, 48, delay, [
	      this.spriteRoot+"/right/running/0.gif",
	      this.spriteRoot+"/right/running/1.gif",
	      this.spriteRoot+"/right/running/2.gif",
	      this.spriteRoot+"/right/running/3.gif"
	    ]),
	    running_left: new Sprite(48, 48, delay, [
	      this.spriteRoot+"/left/running/0.gif",
	      this.spriteRoot+"/left/running/1.gif",
	      this.spriteRoot+"/left/running/2.gif",
	      this.spriteRoot+"/left/running/3.gif"
	    ])
	  };
	  if (this.setExtraSprites) {
	    this.setExtraSprites();
	  }
	};
	
	Jumpman.prototype.checkUnderFeet = function () {
	  var returnVal = false;
	  blocks.forEach(function (block) {
	    if (this.pos.x > block.pos.x - block.sprite.width &&
	        this.pos.x < block.pos.x + block.sprite.width &&
	        this.pos.y+this.sprite.height > block.pos.y-1 &&
	        this.pos.y+this.sprite.height < block.pos.y+block.sprite.height)
	    {
	      if (this.speed.y >= 0) {
	        returnVal = true;
	      }
	    }
	  }.bind(this));
	  return returnVal;
	};
	
	Jumpman.prototype.landOnGround = function (block) {
	  if (this.speed.y > -1) {
	    this.speed.y = 0;
	  }
	  this.pos.y = block.pos.y-this.sprite.height;
	};
	
	Jumpman.prototype.checkSides = function () {
	  var returnVal = "none";
	  blocks.forEach(function (block) {
	    if (this.pos.y+this.sprite.height > block.pos.y &&
	        this.pos.y+this.sprite.height < block.pos.y+block.sprite.height) {
	          if (this.pos.x+50 >= block.pos.x &&
	              this.pos.x+46 <= block.pos.x &&
	            this.speed.x > 0) {
	            returnVal = "right";
	          }
	          if (this.pos.x-50 <= block.pos.x &&
	              this.pos.x-46 >= block.pos.x &&
	            this.speed.x < 0) {
	            returnVal = "left";
	          }
	        }
	  }.bind(this));
	  return returnVal;
	};
	
	Jumpman.prototype.updateSprite = function () {
	  if (this.speed.x === 0) {
	    if (this.facing === "left") {
	      this.sprite = this.sprites.standing_left;
	    } else {
	      this.sprite = this.sprites.standing_right;
	    }
	  } else if (this.speed.x > 0) {
	    this.sprite = this.sprites.running_right;
	  } else if (this.speed.x < 0) {
	    this.sprite = this.sprites.running_left;
	  } if (!this.checkUnderFeet()) {
	    if (this.facing === "left") {
	      this.sprite = this.sprites.jumping_left;
	    } else {
	      this.sprite = this.sprites.jumping_right;
	    }
	  }
	};
	
	Jumpman.prototype.xRightStop = function () {
	  if (this.pos.x%48===0 && this.checkUnderFeet()) {
	    this.speed.x = 0;
	  } else {
	    if (this.speed.x > 0) {
	      setTimeout(this.xRightStop.bind(this), 16);
	    }
	  }
	};
	
	Jumpman.prototype.xLeftStop = function () {
	  if (this.pos.x%48===0 && this.checkUnderFeet()) {
	    this.speed.x = 0;
	  } else {
	    if (this.speed.x < 0) {
	      setTimeout(this.xLeftStop.bind(this), 16);
	    }
	  }
	};
	
	Jumpman.prototype.drawData = function (ctx) {
	  ctx.font = "12px Courier";
	  ctx.strokeText("posX: "+this.pos.x+"("+Math.round(this.pos.x/48)+")", 24, 24);
	  ctx.strokeText("posY: "+this.pos.y+"("+Math.round(this.pos.y/48)+")", 24, 36);
	  ctx.strokeText("spdX: "+this.speed.x, 24, 48);
	  ctx.strokeText("spdY: "+this.speed.y, 24, 60);
	  if (this.checkUnderFeet()) {
	    ctx.beginPath();
	    ctx.arc(98,52,8,0,2*Math.PI);
	    ctx.stroke();
	  }
	};
	
	module.exports = Jumpman;


/***/ },
/* 6 */
/***/ function(module, exports) {

	blocks = [];
	
	module.exports = blocks;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Sprite = __webpack_require__(3);
	var Util = __webpack_require__(8);
	var blocks = __webpack_require__(6);
	var movers = __webpack_require__(9);
	var players = __webpack_require__(10);
	
	var Hammer = function (index, x, y, xspeed, yspeed) {
	  this.type = "hammer";
	  this.index = index;
	  this.attraction = 1.8;
	  this.maxSpeed = 16;
	  this.pos = {
	    x: x,
	    y: y
	  };
	  this.speed = {
	    x: xspeed,
	    y: yspeed
	  };
	  this.accel = {
	    x: 0,
	    y: 0
	  };
	  this.setSprites();
	  this.age = 0;
	  this.soft = 4;
	};
	
	Hammer.prototype.catchCheck = function () {
	  if (Util.distanceBetween(
	    {
	      x: this.pos.x+(this.sprite.width/2),
	      y: this.pos.y+(this.sprite.height/2)
	    },
	    {
	      x: players[0].pos.x+(players[0].sprite.width/2),
	      y: players[0].pos.y+(players[0].sprite.height/2)
	    }
	  ) < players[0].sprite.height) {
	    this.destroy();
	    players[0].updateSpriteRoot();
	  }
	};
	
	Hammer.prototype.destroy = function () {
	  if (this.age > 16) {
	    delete movers[this.index];
	  }
	};
	
	Hammer.prototype.determineAction = function () {
	  this.accel.x = (this.pos.x > players[0].pos.x ?
	    -this.attraction : this.attraction);
	  this.accel.y = (this.pos.y > players[0].pos.y ?
	    -this.attraction : this.attraction);
	  this.catchCheck();
	  this.age ++;
	  if (this.soft > 0) {
	    this.soft --;
	  }
	  if (Util.distanceBetween(this.pos, players[0].pos) > 48*10) {
	    this.speed = Util.moveTowards(this.pos, players[0].pos, this.maxSpeed);
	  }
	};
	
	Hammer.prototype.move = function () {
	  this.speed.x += this.accel.x;
	  this.speed.y += this.accel.y;
	  if (Math.abs(this.speed.x) <= this.maxSpeed) {
	    this.pos.x += this.speed.x;
	  } else {
	    this.pos.x += this.speed.x > 0 ? this.maxSpeed : 0-this.maxSpeed;
	  }
	
	  if (Math.abs(this.speed.y) <= this.maxSpeed/2) {
	    this.pos.y += this.speed.y;
	  } else {
	    this.pos.y += this.speed.y > 0 ? this.maxSpeed/2 : 0-this.maxSpeed/2;
	  }
	};
	
	Hammer.prototype.ricochet = function () {
	  this.speed.x *= (-1);
	  this.speed.y *= (-1);
	};
	
	Hammer.prototype.setSprites = function () {
	  this.leftSprite = new Sprite (48, 48, 0, [
	      "hammer/left/0.gif",
	      "hammer/left/1.gif",
	      "hammer/left/2.gif",
	      "hammer/left/3.gif",
	      "hammer/left/4.gif",
	      "hammer/left/5.gif",
	      "hammer/left/6.gif",
	      "hammer/left/7.gif",
	      "hammer/left/8.gif",
	      "hammer/left/9.gif",
	    ]
	  );
	  this.rightSprite = new Sprite (48, 48, 0, [
	      "hammer/right/0.gif",
	      "hammer/right/1.gif",
	      "hammer/right/2.gif",
	      "hammer/right/3.gif",
	      "hammer/right/4.gif",
	      "hammer/right/5.gif",
	      "hammer/right/6.gif",
	      "hammer/right/7.gif",
	      "hammer/right/8.gif",
	      "hammer/right/9.gif",
	    ]
	  );
	  this.sprite = this.speed.x > 0 ? this.rightSprite : this.leftSprite;
	};
	
	module.exports = Hammer;


/***/ },
/* 8 */
/***/ function(module, exports) {

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


/***/ },
/* 9 */
/***/ function(module, exports) {

	movers = [];
	
	module.exports = movers;


/***/ },
/* 10 */
/***/ function(module, exports) {

	players = [];
	
	module.exports = players;


/***/ },
/* 11 */
/***/ function(module, exports) {

	tiles = [];
	
	module.exports = tiles;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var Sprite = __webpack_require__(3);
	var Jumpman = __webpack_require__(5);
	var Boneheap = __webpack_require__(13);
	var Util = __webpack_require__(8);
	var blocks = __webpack_require__(6);
	var metaBlocks = __webpack_require__(14);
	var players = __webpack_require__(10);
	var movers = __webpack_require__(9);
	
	var Skeleton = function (index, x, y) {
	  this.type = "skeleton";
	  this.index = index;
	  this.age = 0;
	  this.pos = {
	    x: x,
	    y: y
	  };
	  this.speed = {
	    x: 0,
	    y: 0
	  };
	  this.facing = "right";
	  this.frame = "right";
	  this.accel = {
	    x: 0,
	    y: Util.universals.gravity
	  };
	  this.spriteRoot = "skeleton";
	  this.setSprites(5);
	  this.sprite = this.sprites.standing_right;
	
	  // STATS
	  this.sightRange = 330;
	    this.runSpeed = 5;
	  this.jumpPower = 18;
	  this.jumpDistance = 1.3;
	  this.chasingSkill = 3.5;
	};
	
	Util.inherits(Skeleton, Jumpman);
	
	Skeleton.prototype.checkForHammer = function () {
	  movers.forEach(function (mover) {
	    if (mover.type === "hammer" &&
	        Util.distanceBetween(this.pos, mover.pos) < this.sprite.height/2 &&
	        mover.soft <= 0) {
	      mover.ricochet();
	      mover.soft = 8;
	      this.shatter();
	    }
	  }.bind(this));
	};
	
	Skeleton.prototype.checkForPlayer = function () {
	  players.forEach(function (player) {
	    if (this.pos.x < player.pos.x+this.sprite.width+2 &&
	      this.pos.x > player.pos.x-2 &&
	      this.pos.y < player.pos.y+this.sprite.height+2 &&
	      this.pos.y > player.pos.y-2
	    ) {
	      if (this.checkUnderFeet() && player.checkUnderFeet()) {
	        player.skeletonBite();
	      }
	    }
	  }.bind(this));
	};
	
	Skeleton.prototype.checkForJumpBlock = function () {
	  metaBlocks.forEach(function(metaBlock){
	    if (this.pos.x < metaBlock.pos.x+this.sprite.width+2 &&
	        this.pos.x > metaBlock.pos.x-2 &&
	        this.pos.y < metaBlock.pos.y+this.sprite.height+2 &&
	        this.pos.y > metaBlock.pos.y-2
	       ) {
	          if (metaBlock.types.includes("jumpRight") &&
	            this.speed.x > 0) {
	              this.jump();
	            }
	          if (metaBlock.types.includes("jumpLeft") &&
	            this.speed.x < 0) {
	              this.jump();
	            }
	          if (metaBlock.types.includes("switchJumpRight") &&
	            this.pos.y-players[0].pos.y > -48 &&
	            !(Util.distanceBetween(this.pos, players[0].pos) < this.sightRange &&
	            players[0].pos.x < this.pos.x) &&
	            this.speed.x > 0) {
	              this.jump();
	            }
	          if (metaBlock.types.includes("switchJumpLeft") &&
	            this.pos.y-players[0].pos.y > -48 &&
	            !(Util.distanceBetween(this.pos, players[0].pos) < this.sightRange &&
	            players[0].pos.x > this.pos.x) &&
	            this.speed.x < 0) {
	              this.jump();
	            }
	          if (metaBlock.types.includes("goLeft")) {
	            this.speed.x = Math.abs(this.speed.x)*(-1);
	          }
	          if (metaBlock.types.includes("goRight")) {
	            this.speed.x = Math.abs(this.speed.x);
	          }
	        }
	  }.bind(this));
	};
	
	Skeleton.prototype.determineAction = function () {
	  this.facing = (this.speed.x < 0 ? "left" : "right");
	  if (this.checkUnderFeet()) {
	    while (Math.abs(this.speed.x) > this.runSpeed*this.jumpDistance) {
	      this.speed.x *= 0.75;
	    }
	    if (Util.distanceBetween(this.pos, players[0].pos) <= this.sightRange) {
	      // Chance of giving chase
	      if (Math.random()*32 <= this.chasingSkill) {
	        Util.xChase(this, players[0].pos, this.runSpeed);
	      }
	      // If the player is about to escape the skeleton's range, higher chance
	      if (Util.distanceBetween(this.pos, players[0].pos) > this.sightRange*0.9) {
	        if (Math.random()*32 <= this.chasingSkill*7) {
	          Util.xChase(this, players[0].pos, this.runSpeed);
	        }
	      }
	    } else {
	      this.wander();
	    }
	    if (this.age < 12) {
	      this.sprite = this.sprites.rising;
	    }
	    if (this.speed.y > 100) {
	      this.shatter();
	    }
	    this.checkForJumpBlock();
	    this.checkForPlayer();
	    this.dodgeHammer();
	  }
	  this.checkForHammer();
	};
	
	Skeleton.prototype.dodgeHammer = function () {
	  movers.forEach(function (mover) {
	    if (mover.type === "hammer" &&
	        Math.round(Math.random()*2) &&
	        Util.distanceBetween(this.pos, mover.pos) > this.sightRange/5 &&
	        Util.distanceBetween(this.pos, mover.pos) < this.sightRange/3 ) {
	      this.jump();
	    }
	  }.bind(this));
	};
	
	Skeleton.prototype.jump = function () {
	  if (this.checkUnderFeet()) {
	    this.speed.y = 0-this.jumpPower;
	    this.speed.x *= this.jumpDistance;
	    if (this.pos.x < 48*5 && this.speed.x < 0) {
	      this.speed.x *= (-1);
	    }
	  }
	};
	
	Skeleton.prototype.setExtraSprites = function () {
	  this.sprites.rising = new Sprite (48, 48, 2, [
	      "boneheap/collapsing/3.gif",
	      "boneheap/collapsing/2.gif",
	      "boneheap/collapsing/1.gif",
	      "boneheap/collapsing/0.gif"
	    ]
	  );
	};
	
	Skeleton.prototype.shatter = function () {
	  movers[this.index] = new Boneheap (this.index, this.pos);
	};
	
	Skeleton.prototype.wander = function () {
	  if (Math.random()*256*(Math.abs(this.speed.x)+0.5) < 1) {
	    this.speed.x = this.runSpeed;
	  } else if (Math.random()*128 < 2) {
	    this.speed.x = 0-this.runSpeed;
	  }
	};
	
	module.exports = Skeleton;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var Sprite = __webpack_require__(3);
	var Util = __webpack_require__(8);
	var Jumpman = __webpack_require__(5);
	var blocks = __webpack_require__(6);
	var movers = __webpack_require__(9);
	
	var Boneheap = function (index, pos) {
	  this.index = index;
	  this.type = "boneheap";
	  this.age = 0;
	  this.pos = {
	    x: pos.x,
	    y: pos.y
	  };
	  this.speed = {
	    x: 0,
	    y: 0
	  };
	  this.accel = {
	    x: 0,
	    y: Util.universals.gravity
	  };
	  this.setSprites();
	};
	
	Boneheap.prototype.move = function () {
	  this.pos.x += this.speed.x;
	  this.pos.y += this.speed.y;
	  this.speed.x += this.accel.x;
	  this.speed.y += this.accel.y;
	  this.landUnderFeet();
	};
	
	Boneheap.prototype.determineAction = function () {
	  this.age ++;
	  if (this.age === this.collapseSprite.frames.length) {
	    this.sprite = this.staticSprite;
	  }
	};
	
	Boneheap.prototype.landUnderFeet = Jumpman.prototype.landUnderFeet;
	
	Boneheap.prototype.landOnGround = Jumpman.prototype.landOnGround;
	
	Boneheap.prototype.reanimate = function () {
	  var Skeleton = __webpack_require__(12);
	  movers[this.index] = (new Skeleton (this.index, this.pos.x, this.pos.y));
	};
	
	Boneheap.prototype.setSprites = function () {
	  this.collapseSprite = new Sprite (48, 48, 0, [
	      "boneheap/collapsing/0.gif",
	      "boneheap/collapsing/1.gif",
	      "boneheap/collapsing/2.gif",
	      "boneheap/collapsing/3.gif"
	    ]
	  );
	  this.staticSprite = new Sprite (48, 48, 0, [
	      "boneheap/heap.gif"
	    ]
	  );
	  this.sprite = this.collapseSprite;
	};
	
	module.exports = Boneheap;


/***/ },
/* 14 */
/***/ function(module, exports) {

	metaBlocks = [];
	
	module.exports = metaBlocks;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var Sprite = __webpack_require__(3);
	
	var Block = function (x, y, type) {
	  this.pos = {
	    x: x,
	    y: y
	  };
	  this.type = type;
	  this.setSprite();
	};
	
	Block.prototype.setSprite = function () {
	  var typeLookUp = {
	    "top": "blocks/platform_top.gif",
	    "middle": "blocks/platform_middle.gif",
	    "bolted_hang": "blocks/platform_surface_bolt.gif",
	    "hanging": "blocks/platform_surface.gif"
	  };
	  if (!this.type) {
	    this.type = "top";
	  }
	  this.sprite = new Sprite(48, 48, 0, [typeLookUp[this.type]]);
	};
	
	module.exports = Block;


/***/ },
/* 16 */
/***/ function(module, exports) {

	var View = function (topLeftX, topLeftY, bottomRightX, bottomRightY, maxX, maxY) {
	  this.topLeftPos = {x: topLeftX, y: topLeftY};
	  this.width = bottomRightX-topLeftX;
	  this.height = bottomRightY-topLeftY;
	  this.maxX = maxX;
	  this.maxY = maxY;
	};
	
	View.prototype.recenter = function (centerPos) {
	  this.topLeftPos.x = centerPos.x-this.width/2;
	  this.topLeftPos.y = centerPos.y-this.height/2;
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


/***/ },
/* 17 */
/***/ function(module, exports) {

	var keyEvents = function (document, player) {
	  document.onkeydown = function (e) {
	    switch(e.keyCode) {
	    case 68: // d
	    case 39: //right
	      if (player.checkUnderFeet()) {
	        player.speed.x = player.runSpeed;
	      }
	      player.facing = "right";
	      break;
	    case 65: // a
	    case 37: //left
	      if (player.checkUnderFeet()) {
	        player.speed.x = 0-player.runSpeed;
	      }
	      player.facing = "left";
	      break;
	    case 87: // w
	    case 38: //up
	      if (player.checkUnderFeet()) {
	        player.speed.y = 0-player.jumpPower;
	      }
	      break;
	    case 32: //spacebar
	      player.throwHammer();
	      break;
	    }
	  };
	
	  document.onkeyup = function (e) {
	    switch(e.keyCode) {
	    case 68: // d
	    case 39: //right
	      if (player.speed.x > 0) { player.xRightStop(); }
	      break;
	    case 65: // a
	    case 37: //left
	      if (player.speed.x < 0) { player.xLeftStop(); }
	      break;
	    }
	  };
	};
	
	module.exports = keyEvents;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var Zone = __webpack_require__(19);
	
	var subwayPlatform = new Zone ([
	  "--------------------------------------------------------",
	  "------------*--------------------!-----------!----------",
	  "--------FTTTF----FTTTTF-------FTTTTF----FTTFTTF---------",
	  "--------------------------------------------------------",
	  "--------------------------------------------------------",
	  "-----------------FF----FTF-----------------FTF----F-----",
	  "--------------------------------------------------------",
	  "---------------------------------------------!------!---",
	  "XXXXXXXXXXXXXXXXXXXXXXXXX----XXXXXXXXXXXXXXXXXXXXXXXXXXX",
	  "YYYYYYYYYYYYYYYYYYYYYYYYY----YYYYYYYYYYYYYYYYYYYYYYYYYYY",
	  "YYYYYYYYYYYYYYYYYYYYYYYYY----YYYYYYYYYYYYYYYYYYYYYYYYYYY"
	],[
	  "--------------------------------------------------------",
	  "------------}----{-----------<-----}----{{--------------",
	  "--------FTTTF----FTTTTF-------FTTTTF----FTTFTTF---------",
	  "--------------------------------------------------------",
	  "]----------------{}-----{>------------------{}----------[",
	  "]----------------FF----FTF-----------------FTF----F----[",
	  "]------------------------------------------------------[",
	  "]------------}------}--->---<----------->------<-------[",
	  "XXXXXXXXXXXXXXXXXXXXXXX<<---->>XXXXXXXXXXXXXXXXXXXXXXXXX",
	  "YYYYYYYYYYYYYYYYYYYYYY<<<---->>>YYYYYYYYYYYYYYYYYYYYYYYY",
	  "YYYYYYYYYYYYYYYYYYYYYYYYY----YYYYYYYYYYYYYYYYYYYYYYYYYYY"
	]
	);
	
	module.exports = subwayPlatform;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var Block = __webpack_require__(15);
	var metaBlock = __webpack_require__(20);
	var Player = __webpack_require__(2);
	var Skeleton = __webpack_require__(12);
	var Boneheap = __webpack_require__(13);
	var Pigeon = __webpack_require__(21);
	var Wizard = __webpack_require__(26);
	
	var Zone = function (blueprint, metaBlueprint) {
	  this.blueprint = blueprint;
	  this.metaBlueprint = metaBlueprint;
	};
	
	// X Top of a platform
	// Y Middle of a platform
	
	Zone.prototype.build = function (blocks, movers, metaBlocks) {
	  this.blueprint.forEach(function (yLine, yIndex) {
	    yLine.split("").forEach(function (square, xIndex) {
	      if (square === "X") {
	        blocks.push( new Block (xIndex*48, yIndex*48) );
	      } else if (square === "Y") {
	        blocks.push( new Block (xIndex*48, yIndex*48, "middle") );
	      } else if (square === "F") {
	        blocks.push( new Block (xIndex*48, yIndex*48, "bolted_hang") );
	      } else if (square === "T") {
	        blocks.push( new Block (xIndex*48, yIndex*48, "hanging") );
	      } else if (square === "H") {
	        movers.push( new Boneheap (movers.length, {x: xIndex*48, y: yIndex*48}) );
	      } else if (square === "!") {
	        movers.push( new Skeleton (movers.length, xIndex*48, yIndex*48) );
	      } else if (square === "*") {
	        movers.push( new Pigeon (movers.length, xIndex*48, yIndex*48) );
	      }
	    });
	  });
	  if (this.metaBlueprint) {
	    this.metaBlueprint.forEach(function (yLine, yIndex) {
	      yLine.split("").forEach(function (square, xIndex) {
	        if (square === ">") {
	          metaBlocks.push( new metaBlock (xIndex*48, yIndex*48, ["jumpRight"]) );
	        } else if (square === "<") {
	          metaBlocks.push( new metaBlock (xIndex*48, yIndex*48, ["jumpLeft"]) );
	        } else if (square === "{") {
	          metaBlocks.push( new metaBlock (xIndex*48, yIndex*48, ["switchJumpLeft"]) );
	        } else if (square === "}") {
	          metaBlocks.push( new metaBlock (xIndex*48, yIndex*48, ["switchJumpRight"]) );
	        } else if (square === "]") {
	          metaBlocks.push( new metaBlock (xIndex*48, yIndex*48, ["goRight"]) );
	        } else if (square === "[") {
	          metaBlocks.push( new metaBlock (xIndex*48, yIndex*48, ["goLeft"]) );
	        } else if (square === "^") {
	          metaBlocks.push( new metaBlock (xIndex*48, yIndex*48, ["jumpRight", "jumpLeft"]));
	        }
	      });
	    });
	  }
	};
	
	module.exports = Zone;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var Sprite = __webpack_require__(3);
	
	var MetaBlock = function (x, y, types) {
	  this.pos = {
	    x: x,
	    y: y
	  };
	  this.types = types;
	};
	
	module.exports = MetaBlock;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var Sprite = __webpack_require__(3);
	var Jumpman = __webpack_require__(5);
	var Boneheap = __webpack_require__(13);
	var Util = __webpack_require__(8);
	var blocks = __webpack_require__(6);
	var metaBlocks = __webpack_require__(14);
	var players = __webpack_require__(10);
	var movers = __webpack_require__(9);
	
	var Pigeon = function (index, x, y) {
	  this.type = "pigeon";
	  this.index = index;
	  this.age = 0;
	  this.pos = {
	    x: x,
	    y: y
	  };
	  this.speed = {
	    x: 0,
	    y: 0
	  };
	  this.facing = "right";
	  this.frame = "right";
	  this.accel = {
	    x: 0,
	    y: Util.universals.gravity/2
	  };
	  this.spriteRoot = "pigeon";
	  this.setSprites(1);
	  this.sprite = this.sprites.standing_right;
	
	  // STATS
	  this.sightRange = 270;
	  this.runSpeed = 5;
	  this.jumpPower = 6;
	  this.spriteRoot = "pigeonwizard";
	  this.setSprites(2);
	  this.spriteRoot = "wizardpigeon";
	  this.setSprites(2);
	  this.spriteRoot = "pigeon";
	  this.setSprites(2);
	};
	
	Util.inherits(Pigeon, Jumpman);
	
	Pigeon.prototype.animateTransformation = function () {
	  if (this.age < 2) {
	    this.spriteRoot = "pigeonwizard";
	    this.setSprites(2);
	  } else if (this.age === 4) {
	    this.spriteRoot = "wizardpigeon";
	    this.setSprites(2);
	  } else if (this.age === 22) {
	    this.spriteRoot = "pigeon";
	    this.setSprites(2);
	  }
	};
	
	Pigeon.prototype.checkForBoneheap = function () {
	  var boneheap = Util.findByType("boneheap", movers);
	  var hammer = Util.findByType("hammer", movers);
	  if (boneheap && Util.distanceBetween(this.pos, boneheap.pos) < this.sightRange &&
	      !(hammer &&
	      Util.distanceBetween(this.pos, hammer.pos) > this.sightRange/12 &&
	      Util.distanceBetween(this.pos, hammer.pos) < this.sightRange/2 )
	    ) {
	    this.speed.x = 0;
	    this.speed.y = 0;
	    this.turnIntoAPerson();
	  }
	};
	
	Pigeon.prototype.checkForHammer = function () {
	  movers.forEach(function (mover) {
	    if (mover.type === "hammer" &&
	        Util.distanceBetween(this.pos, mover.pos) < this.sprite.height/4 &&
	        mover.soft <= 0) {
	      mover.ricochet();
	      mover.soft = 8;
	      this.transmogrify();
	    }
	  }.bind(this));
	};
	
	Pigeon.prototype.determineAction = function () {
	  if (players[0].age > 12) {
	    this.animateTransformation();
	  }
	  if (this.speed.y > 3) {
	    this.speed.y = 3;
	  }
	  if (this.pos.y > players[0].pos.y) {
	    this.jump();
	  }
	  if (this.speed.x !== 0 && this.speed.y === 0 && Math.random() > 0.9) {
	    this.jump();
	  }
	  if (Util.typeCount("hammer", movers) === 0 && Util.typeCount("boneheap", movers) === 0) {
	    this.wander();
	    return;
	  }
	  if (Util.typeCount("hammer", movers) > 0) {
	    var hammer = Util.findByType("hammer", movers);
	    if (Util.distanceBetween(this.pos, hammer.pos) < this.sightRange) {
	      this.dodgeHammer();
	    }
	  }
	  if (Util.typeCount("boneheap", movers) > 0 && Math.random()*64 < 1) {
	    var boneheap = Util.findByType("boneheap", movers);
	    this.speed.x = this.pos.x < boneheap.pos.x ? this.runSpeed : 0-this.runSpeed;
	  }
	  this.checkForHammer();
	  this.checkForBoneheap();
	};
	
	Pigeon.prototype.dodgeHammer = function () {
	  var hammer = Util.findByType("hammer", movers);
	  var boneheap = Util.findByType("boneheap", movers);
	  this.jump();
	  this.speed.x = this.pos.x > hammer.pos.x ? this.runSpeed : 0-this.runSpeed;
	  if (boneheap) {
	    this.speed.x = this.pos.x < boneheap.pos.x ? this.runSpeed : 0-this.runSpeed;
	  }
	};
	
	Pigeon.prototype.jump = function () {
	  this.speed.y = 0-this.jumpPower;
	};
	
	Pigeon.prototype.setExtraSprites = function () {
	  this.sprites.jumping_right = this.sprites.running_right;
	  this.sprites.jumping_left = this.sprites.running_left;
	};
	
	Pigeon.prototype.transmogrify = function () {
	  var Wizard = __webpack_require__(26);
	  movers[this.index] = new Wizard (this.index, this.pos.x, this.pos.y);
	};
	
	Pigeon.prototype.turnIntoAPerson = function () {
	  if (this.age > 48) {
	    this.transmogrify();
	  }
	};
	
	Pigeon.prototype.wander = function () {
	  if (!Math.floor(Math.random()*128)) {
	    this.facing = this.facing === "right" ? "left" : "right";
	    this.speed.x = 0;
	  }
	};
	
	module.exports = Pigeon;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var Background = __webpack_require__(23);
	var Sprite = __webpack_require__(3);
	
	var subwayPlatform = new Background ([
	  "---------------------------",
	  "---------------------------",
	  "---------------------------",
	  "---------------------------",
	  "---------------------------",
	  "===========================",
	  "---------------------------",
	  "---------------------------",
	  "---------------------------",
	  "===========================",
	  "==========================="
	],
	{
	  "-": {sprite: new Sprite (48, 48, 0, ["tile/brick_light.gif"]),
	        depth: 5},
	  "=": {sprite: new Sprite (48, 48, 0, ["tile/brick_dark.gif"]),
	        depth: 5}
	});
	
	module.exports = subwayPlatform;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var Tile = __webpack_require__(24);
	
	var Background = function (blueprint, spriteKey) {
	  this.blueprint = blueprint;
	  this.spriteKey = spriteKey;
	};
	
	Background.prototype.build = function (tiles, depth) {
	  this.blueprint.forEach(function (yLine, yIndex) {
	    yLine.split("").forEach(function (square, xIndex) {
	      if (this.spriteKey[square]) {
	        tiles.push( new Tile (xIndex*48, yIndex*48, this.spriteKey[square].sprite, this.spriteKey[square].depth) );
	      }
	    }.bind(this));
	  }.bind(this));
	};
	
	module.exports = Background;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var Sprite = __webpack_require__(3);
	
	var Tile = function (x, y, sprite, depth) {
	  this.pos = {
	    x: x,
	    y: y
	  };
	  this.depth = depth;
	  this.sprite = sprite;
	};
	
	module.exports = Tile;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var Background = __webpack_require__(23);
	var Sprite = __webpack_require__(3);
	
	var subwayPlatform = new Background ([
	  "=======================================",
	  "=======================================",
	  "=======================================",
	  "FFFL FFFFL FFFFL FFFFL FFFFL FFFFL FFFF",
	  "    I     I     I     I     I     I    ",
	  "    I     I     I     I     I     I    ",
	  "    I     I     I     I     I     I    ",
	  "    I     I     I     I     I     I    ",
	  "    I     I     I     I     I     I    ",
	  "    I     I     I     I     I     I    ",
	  "    I     I     I     I     I     I    "
	],
	{
	  "I": {sprite: new Sprite (48, 48, 0, ["tile/pillar_middle.gif"]),
	        depth: 2},
	  "F": {sprite: new Sprite (48, 48, 0, ["tile/girder_top.gif"]),
	        depth: 2},
	  "L": {sprite: new Sprite (144, 48, 0, ["tile/pillar_head.gif"]),
	        depth: 2},
	  "=": {sprite: new Sprite (48, 48, 0, ["tile/brick_dark.gif"]),
	        depth: 2},
	  "J": {sprite: new Sprite (144, 48, 0, ["tile/sign_jay.gif"]),
	        depth: 5}
	});
	
	module.exports = subwayPlatform;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var Sprite = __webpack_require__(3);
	var Jumpman = __webpack_require__(5);
	var Boneheap = __webpack_require__(13);
	var Util = __webpack_require__(8);
	var blocks = __webpack_require__(6);
	var metaBlocks = __webpack_require__(14);
	var players = __webpack_require__(10);
	var movers = __webpack_require__(9);
	
	var Wizard = function (index, x, y) {
	  this.type = "wizard";
	  this.index = index;
	  this.pos = {
	    x: x,
	    y: y
	  };
	  this.speed = {
	    x: 0,
	    y: 0
	  };
	  this.facing = "right";
	  this.frame = "right";
	  this.accel = {
	    x: 0,
	    y: Util.universals.gravity
	  };
	  this.spriteRoot = "wizardpigeon";
	  this.setSprites(6);
	  this.sprite = this.sprites.standing_right;
	
	  // STATS
	  this.sightRange = 270;
	  this.runSpeed = 4;
	  this.jumpPower = 18;
	  this.jumpDistance = 1.4;
	  this.chasingSkill = 2.5;
	  this.magicRange = 48;
	  this.age = 0;
	  this.deathStop = 20;
	  this.dying = false;
	};
	
	Util.inherits(Wizard, Jumpman);
	
	Wizard.prototype.animateTransformation = function () {
	  if (this.age < 2) {
	    this.spriteRoot = "wizardpigeon";
	    this.setSprites(2);
	  } else if (this.age === 4) {
	    this.spriteRoot = "pigeonwizard";
	    this.setSprites(2);
	  } else if (this.age === 8) {
	    this.spriteRoot = "wizard";
	    this.setSprites(5);
	  }
	};
	
	Wizard.prototype.checkForBoneheap = function () {
	  var boneheap = Util.findByType("boneheap", movers);
	  if (boneheap && Util.distanceBetween(this.pos, boneheap.pos) < this.magicRange) {
	    this.speed.x = 0;
	    boneheap.reanimate(this.index, this.pos.x, this.pos.y);
	  }
	};
	
	Wizard.prototype.checkForHammer = function () {
	  movers.forEach(function (mover) {
	    if (mover.type === "hammer" &&
	        Util.distanceBetween(this.pos, mover.pos) < this.sprite.height/2 &&
	        mover.soft <= 0) {
	      mover.ricochet();
	      mover.soft = 8;
	      this.die();
	    }
	  }.bind(this));
	};
	
	Wizard.prototype.checkForJumpBlock = function () {
	  metaBlocks.forEach(function(metaBlock){
	    if (this.pos.x < metaBlock.pos.x+this.sprite.width+2 &&
	        this.pos.x > metaBlock.pos.x-2 &&
	        this.pos.y < metaBlock.pos.y+this.sprite.height+2 &&
	        this.pos.y > metaBlock.pos.y-2
	       ) {
	          if (metaBlock.types.includes("jumpRight") &&
	            this.speed.x > 0) {
	              this.jump();
	            }
	          if (metaBlock.types.includes("jumpLeft") &&
	            this.speed.x < 0) {
	              this.jump();
	            }
	          if (metaBlock.types.includes("switchJumpRight") &&
	            this.pos.y-players[0].pos.y > -48 &&
	            !(Util.distanceBetween(this.pos, players[0].pos) < this.sightRange &&
	            players[0].pos.x < this.pos.x) &&
	            this.speed.x > 0) {
	              this.jump();
	            }
	          if (metaBlock.types.includes("switchJumpLeft") &&
	            this.pos.y-players[0].pos.y > -48 &&
	            !(Util.distanceBetween(this.pos, players[0].pos) < this.sightRange &&
	            players[0].pos.x > this.pos.x) &&
	            this.speed.x < 0) {
	              this.jump();
	            }
	          if (metaBlock.types.includes("goLeft")) {
	            this.speed.x = Math.abs(this.speed.x)*(-1);
	          }
	          if (metaBlock.types.includes("goRight")) {
	            this.speed.x = Math.abs(this.speed.x);
	          }
	        }
	  }.bind(this));
	};
	
	Wizard.prototype.die = function () {
	  this.dying = true;
	  this.updateSprite = function () {
	    this.sprite = this.sprites.shrivel;
	  };
	};
	
	Wizard.prototype.shatter = function () {
	  movers[this.index] = new Boneheap (this.index, this.pos);
	};
	
	Wizard.prototype.determineAction = function () {
	  this.animateTransformation();
	  this.facing = (this.speed.x < 0 ? "left" : "right");
	  if (this.checkUnderFeet()) {
	    while (Math.abs(this.speed.x) > this.runSpeed*this.jumpDistance) {
	      this.speed.x *= 0.75;
	    }
	    var boneheap = Util.findByType("boneheap", movers);
	    if (boneheap) {
	      // Chance of going after a heap
	      if (Math.random()*32 <= this.chasingSkill) {
	        Util.xChase(this, boneheap.pos, this.runSpeed);
	      }
	    } else {
	      this.wander();
	    }
	    this.checkForJumpBlock();
	    this.checkForHammer();
	    this.dodgeHammer();
	  }
	  if (this.pos.y > players[0].pos.y+(48*4)) {
	    this.turnIntoABird();
	  }
	  if (this.dying) {
	    this.deathStop --;
	  }
	  if (this.deathStop === 0) {
	    this.shatter();
	  }
	  this.checkForBoneheap();
	};
	
	Wizard.prototype.dodgeHammer = function () {
	  movers.forEach(function (mover) {
	
	    if (mover.type === "hammer" &&
	        Util.distanceBetween(this.pos, mover.pos) > this.sightRange/24 &&
	        Util.distanceBetween(this.pos, mover.pos) < this.sightRange/2 ) {
	      this.turnIntoABird();
	    }
	  }.bind(this));
	};
	
	Wizard.prototype.jump = function () {
	  if (this.checkUnderFeet()) {
	    this.speed.y = 0-this.jumpPower;
	    this.speed.x *= this.jumpDistance;
	    if (this.pos.x < 48*5 && this.speed.x < 0) {
	      this.speed.x *= (-1);
	    }
	  }
	};
	
	Wizard.prototype.lowJump = function () {
	  if (this.checkUnderFeet()) {
	    this.speed.y = 0-this.jumpPower/1.3;
	    this.speed.x *= this.jumpDistance;
	    if (this.pos.x < 48*5 && this.speed.x < 0) {
	      this.speed.x *= (-1);
	    }
	  }
	};
	
	Wizard.prototype.setExtraSprites = function () {
	  this.sprites.shrivel = new Sprite(48, 48, 2, [
	    this.spriteRoot+"/"+this.facing+"/shrivel/0.gif",
	    this.spriteRoot+"/"+this.facing+"/shrivel/1.gif",
	    this.spriteRoot+"/"+this.facing+"/shrivel/2.gif",
	    this.spriteRoot+"/"+this.facing+"/shrivel/3.gif",
	    this.spriteRoot+"/"+this.facing+"/shrivel/4.gif",
	    this.spriteRoot+"/"+this.facing+"/shrivel/5.gif",
	    this.spriteRoot+"/"+this.facing+"/shrivel/6.gif",
	  ]);
	};
	
	Wizard.prototype.transmogrify = function () {
	  var Pigeon = __webpack_require__(21);
	  movers[this.index] = new Pigeon (this.index, this.pos.x, this.pos.y);
	};
	
	Wizard.prototype.turnIntoABird = function () {
	  if (this.age > 21 && !this.dying) {
	    this.spriteRoot = "pigeonwizard";
	    this.setSprites(1);
	    if (this.age % 248 === 0) {
	      this.transmogrify();
	    } else {
	      this.age ++;
	      this.turnIntoABird();
	    }
	  }
	};
	
	Wizard.prototype.wander = function () {
	  if (Math.random()*256*(Math.abs(this.speed.x)+0.5) < 1) {
	    this.speed.x = this.runSpeed;
	  } else if (Math.random()*128 < 2) {
	    this.speed.x = 0-this.runSpeed;
	  }
	};
	
	module.exports = Wizard;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map
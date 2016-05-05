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
	var Skeleton = __webpack_require__(9);
	var Block = __webpack_require__(12);
	var View = __webpack_require__(13);
	var keyEvents = __webpack_require__(14);
	var blocks = __webpack_require__(6);
	var metaBlocks = __webpack_require__(10);
	var tiles = __webpack_require__(8);
	var movers = __webpack_require__(15);
	var players = __webpack_require__(11);
	
	window.onload = function () {
	  var canvas = document.getElementById("canvas");
	
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	players.push( new Player (8*48, 5*48) );
	keyEvents(document, players[0]);
	
	var zone = __webpack_require__(16);
	zone.build(blocks, movers, metaBlocks);
	
	var backgroundBricks = __webpack_require__(19);
	backgroundBricks.build(tiles);
	
	var backgroundPillars = __webpack_require__(22);
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
	      mover.determineAction();
	      mover.move();
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
	var Util = __webpack_require__(7);
	var blocks = __webpack_require__(6);
	var tiles = __webpack_require__(8);
	
	var Player = function (x, y) {
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
	    y: 1
	  };
	  this.spriteRoot = "player";
	  this.setSprites(4);
	  this.sprite = this.sprites.standing_right;
	
	  // STATS
	  this.runSpeed = 6;
	  this.jumpPower = 17;
	  this.maxHealth = 8;
	
	  this.health = this.maxHealth;
	  this.damageRecover = 0;
	};
	
	Util.inherits(Player, Jumpman);
	
	Player.prototype.drawData = function (ctx) {
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
	  if (this.pos.x%48===0) {
	    this.speed.x = 0;
	  } else {
	    if (this.speed.x > 0) {
	      setTimeout(this.xRightStop.bind(this), 16);
	    }
	  }
	};
	
	Jumpman.prototype.xLeftStop = function () {
	  if (this.pos.x%48===0) {
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
/***/ function(module, exports) {

	var Util = {
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
	
	  xChase: function (chaser, targetPos, speed) {
	    if (chaser.pos.x > players[0].pos.x) {
	      chaser.speed.x = 0-speed;
	    } else if (chaser.pos.x < players[0].pos.x) {
	      chaser.speed.x = speed;
	    }
	  }
	};
	
	module.exports = Util;


/***/ },
/* 8 */
/***/ function(module, exports) {

	tiles = [];
	
	module.exports = tiles;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var Sprite = __webpack_require__(3);
	var Jumpman = __webpack_require__(5);
	var Util = __webpack_require__(7);
	var blocks = __webpack_require__(6);
	var metaBlocks = __webpack_require__(10);
	var players = __webpack_require__(11);
	
	var Skeleton = function (x, y) {
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
	    y: 1
	  };
	  this.spriteRoot = "skeleton";
	  this.setSprites(5);
	  this.sprite = this.sprites.standing_right;
	
	  // STATS
	  this.sightRange = 330;
	    this.runSpeed = 4;
	  this.jumpPower = 18;
	  this.chasingSkill = 2.75;
	};
	
	Util.inherits(Skeleton, Jumpman);
	
	Skeleton.prototype.determineAction = function () {
	  if (this.checkUnderFeet()) {
	    while (Math.abs(this.speed.x) > this.runSpeed*1.96) {
	      this.speed.x *= 0.92;
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
	    this.checkForJumpBlock();
	    this.checkForPlayer();
	  }
	};
	
	Skeleton.prototype.wander = function () {
	  if (Math.random()*256 < 1) {
	    this.speed.x = this.runSpeed;
	  } else if (Math.random()*128 < 2) {
	    this.speed.x = 0-this.runSpeed;
	  }
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
	            this.speed.x > 0) {
	              this.jump();
	            }
	          if (metaBlock.types.includes("switchJumpLeft") &&
	            this.pos.y-players[0].pos.y > -48 &&
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
	
	Skeleton.prototype.jump = function () {
	  this.speed.y = 0-this.jumpPower;
	  this.speed.x *= 1.96;
	};
	
	module.exports = Skeleton;


/***/ },
/* 10 */
/***/ function(module, exports) {

	metaBlocks = [];
	
	module.exports = metaBlocks;


/***/ },
/* 11 */
/***/ function(module, exports) {

	players = [];
	
	module.exports = players;


/***/ },
/* 12 */
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
/* 13 */
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
/* 14 */
/***/ function(module, exports) {

	var keyEvents = function (document, player) {
	  document.onkeydown = function (e) {
	    switch(e.keyCode) {
	    case 68: // d
	    case 39: //right
	      player.speed.x = player.runSpeed;
	      player.facing = "right";
	      break;
	    case 65: // a
	    case 37: //left
	      player.speed.x = 0-player.runSpeed;
	      player.facing = "left";
	      break;
	    case 87: // w
	    case 38: //up
	      if (player.checkUnderFeet()) {
	        player.speed.y = 0-player.jumpPower;
	      }
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
/* 15 */
/***/ function(module, exports) {

	movers = [];
	
	module.exports = movers;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var Zone = __webpack_require__(17);
	
	
	var subwayPlatform = new Zone ([
	  "--------------------------------------------------------",
	  "---------------------------------------------!----------",
	  "--------FTTTF----FTTTF--------FTTTTF----FTTFTTF---------",
	  "--------------------------------------------------------",
	  "--------------------------------------------------------",
	  "-----------------------FF------------------FTF----F-----",
	  "--------------------------------------------------------",
	  "---------------------------------------------!------!---",
	  "XXXXXXXXXXXXXXXXXXXXXXXXX----XXXXXXXXXXXXXXXXXXXXXXXXXXX",
	  "YYYYYYYYYYYYYYYYYYYYYYYYY----YYYYYYYYYYYYYYYYYYYYYYYYYYY",
	  "YYYYYYYYYYYYYYYYYYYYYYYYY----YYYYYYYYYYYYYYYYYYYYYYYYYYY"
	],[
	  "--------------------------------------------------------",
	  "------------}---{------------<------}--{----------------",
	  "--------FTTTF----FTTTF--------FTTTTF----FTTFTTF---------",
	  "--------------------------------------------------------",
	  "]----------------------{>------------------{-----------[",
	  "]----------------------FF------------------FTF----F----[",
	  "]------------------------------------------------------[",
	  "]------------------->--->---<----------->------<-------[",
	  "XXXXXXXXXXXXXXXXXXXXXXX<<---->>XXXXXXXXXXXXXXXXXXXXXXXXX",
	  "YYYYYYYYYYYYYYYYYYYYYY<<<---->>>YYYYYYYYYYYYYYYYYYYYYYYY",
	  "YYYYYYYYYYYYYYYYYYYYYYYYY----YYYYYYYYYYYYYYYYYYYYYYYYYYY"
	]
	);
	
	module.exports = subwayPlatform;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var Block = __webpack_require__(12);
	var metaBlock = __webpack_require__(18);
	var Player = __webpack_require__(2);
	var Skeleton = __webpack_require__(9);
	
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
	      } else if (square === "!") {
	        movers.push( new Skeleton (xIndex*48, yIndex*48) );
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
/* 18 */
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
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var Background = __webpack_require__(20);
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
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var Tile = __webpack_require__(21);
	
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
/* 21 */
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
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var Background = __webpack_require__(20);
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map
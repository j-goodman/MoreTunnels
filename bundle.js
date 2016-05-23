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

	Window.newGame = function () {
	  var renderZone = __webpack_require__(1);
	  var Player = __webpack_require__(2);
	  var Skeleton = __webpack_require__(15);
	  var Block = __webpack_require__(21);
	  var Util = __webpack_require__(6);
	  var View = __webpack_require__(22);
	  var keyEvents = __webpack_require__(23);
	  var blocks = __webpack_require__(7);
	  var aiHints = __webpack_require__(20);
	  var tiles = __webpack_require__(13);
	  var overlays = __webpack_require__(14);
	  var movers = __webpack_require__(10);
	  var trains = __webpack_require__(24);
	  var players = __webpack_require__(11);
	  var Conductor = __webpack_require__(25);
	
	  var Game = {
	    canvas: null,
	    ctx: null,
	    players: players,
	    movers: movers,
	    trains: trains,
	    tiles: tiles,
	    overlays: overlays,
	    blocks: blocks,
	    metaBlocks: metaBlocks,
	    aiHints: aiHints,
	    keyEvents: keyEvents,
	    renderZone: renderZone,
	    Conductor: Conductor,
	    Player: Player,
	    Skeleton: Skeleton,
	    Block: Block,
	    View: View,
	    Util: Util
	  };
	
	  Game.startUpCanvas = function () {
	    window.onload = function () {
	      var canvas = document.getElementById("canvas");
	      var ctx = canvas.getContext('2d');
	      this.canvas = canvas;
	      this.ctx = ctx;
	      Util.universals.canvasContext = ctx;
	      ctx.clearRect(0, 0, canvas.width, canvas.height);
	    }.bind(this);
	  };
	
	  Game.buildZone = function (zoneObject) {
	    var zone = __webpack_require__(28)(zoneObject.address);
	    this.zone = zone;
	
	    this.setView();
	
	    var callback = function () {
	      this.setupKeyControls();
	    }.bind(this);
	
	    this.zone.build(this.blocks, this.movers, this.players, this.metaBlocks, callback);
	
	    var backgroundBricks = __webpack_require__(28)(zoneObject.backgroundA);
	    backgroundBricks.build(tiles);
	
	    var backgroundPillars = __webpack_require__(28)(zoneObject.backgroundB);
	    backgroundPillars.build(tiles, 2);
	    backgroundPillars.build(tiles, 3);
	  };
	
	  Game.setupKeyControls = function () {
	    this.keyEvents(document, this.players[0]);
	  };
	
	  Game.setView = function () {
	    var view = new this.View (0, 0, 640, 480, 48*(this.zone.blueprint[0].length-1), 48*this.zone.blueprint.length);
	    this.view = view;
	    Util.universals.view = view;
	    Util.universals.roomBottomRight = {x: 48*(this.zone.blueprint[0].length-1), y: 48*this.zone.blueprint.length};
	  };
	
	  Game.playRound = function (zoneObject) {
	    if (zoneObject) {
	      console.log("START LEVEL: " + zoneObject.name);
	      Game.buildZone(zoneObject);
	      if (this.interval) {
	        clearInterval(this.interval);
	      }
	      this.interval = setInterval(function () {
	        var ctx = this.ctx;
	        if (ctx) {
	          this.ctx.fillStyle = "black";
	          this.ctx.fillRect(0, 0, canvas.width, canvas.height);
	        }
	
	        this.tiles.forEach(function(tile, idx) {
	          tile.sprite.depthDraw(this.ctx, tile.pos, this.view.topLeftPos, tile.depth);
	        }.bind(this));
	
	        var conductor = new this.Conductor (this.zone);
	        conductor.manageTrains();
	
	        this.blocks.forEach(function(block){
	          block.sprite.draw(this.ctx, block.pos, this.view.topLeftPos);
	        }.bind(this));
	
	        for (var i = 0; i <= this.trains.length; i++) {
	          var train = this.trains[i];
	          if (train) {
	            train.sprite.draw(this.ctx, train.pos, this.view.topLeftPos);
	          }
	        }
	
	        for (var j = this.movers.length-1; j >= 0; j--) {
	          var mover = this.movers[j];
	          if (mover) {
	            mover.sprite.draw(this.ctx, mover.pos, this.view.topLeftPos);
	          }
	        }
	
	        this.overlays.forEach(function(overlay, idx) {
	          overlay.sprite.depthDraw(this.ctx, overlay.pos, this.view.topLeftPos, overlay.depth);
	          if (overlay.virtual) {
	            delete this.overlays[idx];
	          }
	        }.bind(this));
	
	        if (this.ctx) {
	          this.players[0].sprite.draw(this.ctx, players[0].pos, this.view.topLeftPos);
	        }
	
	        this.players[0].move();
	
	        this.movers.forEach(function(mover){
	          mover.move();
	          mover.act();
	        });
	
	        this.trains.forEach(function(train){
	          train.move();
	          train.act();
	        });
	
	        this.view.recenter(players[0].pos);
	      }.bind(this), 32);
	    }
	  };
	
	  Game.playGame = function (level) {
	    this.Util.nextLevel = function () {
	      if (Util.level) {
	        Util.level ++;
	      } else {
	        Util.level = 1;
	      }
	      this.playGame(Util.level);
	      this.trains = [];
	      players[0].invisible = false;
	      players[0].onSubway = false;
	    }.bind(this);
	
	    switch (Util.level) {
	      case 1:
	        this.playRound({
	          name: "Kingston-Throop",
	          // Level One, the player fights wizards, skeletons, and one burningman.
	          address: './zones/throop.js',
	          backgroundA: './backgrounds/throopBricks.js',
	          backgroundB: './backgrounds/throopPillars.js'
	        });
	      break;
	      case 2:
	        this.playRound({
	          name: "Broadway Junction",
	          // Level Two, the player fights two shoggoths and some skeletons.
	          address: './zones/junction.js',
	          backgroundA: './backgrounds/junctionBricks.js',
	          backgroundB: './backgrounds/junctionLamps.js'
	        });
	        if (this.players.length > 1) {
	          this.players.shift();
	        }
	      break;
	    }
	  };
	
	  Game.startUpCanvas();
	  Game.playGame(1);
	};
	
	Window.newGame();


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
	var Hammer = __webpack_require__(8);
	var Util = __webpack_require__(6);
	var UpKey = __webpack_require__(12);
	var blocks = __webpack_require__(7);
	var movers = __webpack_require__(10);
	var tiles = __webpack_require__(13);
	var overlays = __webpack_require__(14);
	
	var Player = function (index, x, y) {
	  this.age = 0;
	  this.index = index;
	  this.type = "player";
	  this.spriteSize = 48;
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
	  this.stats = {
	    runSpeed: 6,
	    jumpPower: 17,
	    throwPower: 1,
	    maxHealth: 8
	  };
	
	  this.hasHammer = true;
	
	  this.dead = false;
	  this.health = this.stats.maxHealth;
	  this.healthHundredth = 100;
	  this.status = "normal";
	  this.damageRecover = 0;
	
	  // this.spriteRoot = "player";
	  // this.setSprites(4);
	  // this.spriteRoot = "hammerman";
	  // this.setSprites(4);
	};
	
	Util.inherits(Player, Jumpman);
	
	Player.prototype.checkIfDead = function () {
	  if (this.health <= 0 && !this.dead) {
	    this.sprite = this.sprites["falling_" + this.facing];
	    this.sprite.addAnimationEndCallback(function () {
	      this.sprite = this.sprites["dead_" + this.facing];
	      this.updateSprite = function () {};
	      this.drawMeter = function () {};
	      this.dead = true;
	    }.bind(this));
	    this.xStop();
	  }
	};
	
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
	
	Player.prototype.drawUpKey = function () {
	  overlays.push( new UpKey (this.pos.x, this.pos.y-64) );
	};
	
	Player.prototype.drawMeter = function () {
	  overlays.push( new Meter (this.pos.x, this.pos.y-64, this.health) );
	};
	
	Player.prototype.enterSubway = function (subway) {
	  this.speed.x = 0;
	  this.speed.y = 0;
	  this.invisible = true;
	  this.onSubway = subway;
	};
	
	Player.prototype.move = function () {
	  this.age++;
	  this.upKeyAux = null;
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
	  if (this.onSubway) {
	    this.pos.x += Math.round(this.onSubway.speed.x*1.25);
	  }
	  this.checkIfDead();
	  Util.ironWalls(this);
	};
	
	Player.prototype.skeletonBite = function () {
	  if (this.damageRecover < 0) {
	    this.damageRecover = 64;
	    if (this.health <= 8 && this.health > 0) {
	      this.health -= 1;
	      return true;
	    }
	  }
	};
	
	Player.prototype.fireballBite = Player.prototype.skeletonBite;
	
	Player.prototype.shoggothBite = function (shoggoth) {
	  if (this.damageRecover < 0) {
	    this.damageRecover = 64;
	    if (this.health <= 8 && this.health > 0) {
	      this.health -= 1;
	      this.jump();
	      this.speed.x = this.pos.x < shoggoth.pos.x ? 0-this.stats.runSpeed : this.stats.runSpeed;
	      this.speed.y *= 0.65;
	    }
	  }
	};
	
	Player.prototype.shogBeamBite = function () {
	  if (this.damageRecover < 0) {
	    this.damageRecover = 64;
	    if (this.health <= 8 && this.health > 1) {
	      this.health -= 2;
	    } else if (this.health === 1) {
	      this.health = 0;
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
	
	Player.prototype.jump = function () {
	  this.speed.y = 0-this.stats.jumpPower;
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
	  this.sprites.dead_right = new Sprite(this.spriteSize, this.spriteSize, 0, ["playerfall/right/dead.gif"]);
	  this.sprites.dead_left = new Sprite(this.spriteSize, this.spriteSize, 0, ["playerfall/left/dead.gif"]);
	  this.sprites.falling_right = new Sprite(this.spriteSize, this.spriteSize, 4, [
	    "playerfall/right/dying/0.gif",
	    "playerfall/right/dying/1.gif",
	    "playerfall/right/dying/2.gif",
	    "playerfall/right/dying/3.gif"
	  ]);
	  this.sprites.falling_left = new Sprite(this.spriteSize, this.spriteSize, 4, [
	    "playerfall/left/dying/0.gif",
	    "playerfall/left/dying/1.gif",
	    "playerfall/left/dying/2.gif",
	    "playerfall/left/dying/3.gif"
	  ]);
	};
	
	Player.prototype.throwHammer = function () {
	  if (this.hammerCount() === 0 && !this.dead) {
	    movers.push(new Hammer (movers.length, this.pos.x, this.pos.y, this.speed.x, this.speed.y, (this.facing === "right" ? this.stats.throwPower : -this.stats.throwPower)));
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
	
	Player.prototype.upKey = function () {
	  if (this.upKeyAux) {
	    this.upKeyAux();
	  } else {
	    this.jump();
	  }
	};
	
	Player.prototype.upKeyAux = null;
	
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
	  sourcePathArray.forEach(function (path, index) {
	    this.frames[index] = new Image (width, height);
	    this.frames[index].src = "./sprites/"+path;
	  }.bind(this));
	  this.endCallback = null;
	};
	
	Sprite.prototype.frame = 0;
	
	Sprite.prototype.addAnimationEndCallback = function (callback) {
	  this.endCallback = function () {
	    callback();
	    this.endCallback = null;
	  }.bind(this);
	};
	
	Sprite.prototype.animate = function () {
	  if (this.frames.length > 1) {
	    if (this.frameDelay === 0) {
	        this.frame++;
	        if (this.frame === this.frames.length) {
	          this.frame = 0;
	          if (this.endCallback) {
	            this.endCallback();
	          }
	        }
	    }
	    this.frameDelay-=1;
	    if (this.frameDelay < 0) {
	      this.frameDelay = this.frameDelayMax;
	    }
	  }
	};
	
	Sprite.prototype.draw = function (ctx, pos, viewAnchor) {
	  if (ctx) {
	    ctx.drawImage(
	      this.frames[this.frame],
	      pos.x-viewAnchor.x,
	      pos.y-viewAnchor.y,
	      this.width,
	      this.height
	    );
	    this.animate();
	  }
	};
	
	Sprite.prototype.depthDraw = function (ctx, pos, viewAnchor, depthFactor) {
	  //The depth factor should be a multiple of 0.5 between 1.5 and 5
	  if (ctx) {
	    ctx.drawImage(
	      this.frames[this.frame],
	      pos.x-(viewAnchor.x/depthFactor),
	      pos.y-(viewAnchor.y),
	      this.width,
	      this.height
	    );
	    this.animate();
	  }
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
	  this.virtual = true;
	  this.sprite = new Sprite (48, 48, 0, ["meter/"+health+".gif"]);
	};
	
	module.exports = Meter;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Sprite = __webpack_require__(3);
	var Util = __webpack_require__(6);
	var blocks = __webpack_require__(7);
	
	var Jumpman = function () {
	};
	
	Jumpman.prototype.avoidRoomEdge = function () {
	  if (this.checkUnderFeet()) {
	    if (this.pos.x < Math.abs(this.stats.runSpeed) * 20) {
	      this.speed.x = Math.abs(this.stats.runSpeed);
	    } else if (this.pos.x > Util.universals.roomBottomRight.x - Math.abs(this.stats.runSpeed * 20)) {
	      this.speed.x = 0-Math.abs(this.stats.runSpeed);
	    }
	  }
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
	  Util.ironWalls(this);
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
	    standing_right: new Sprite(this.spriteSize, this.spriteSize, 0, [this.spriteRoot+"/right/standing.gif"]),
	    jumping_right: new Sprite(this.spriteSize, this.spriteSize, 0, [this.spriteRoot+"/right/jumping.gif"]),
	    standing_left: new Sprite(this.spriteSize, this.spriteSize, 0, [this.spriteRoot+"/left/standing.gif"]),
	    jumping_left: new Sprite(this.spriteSize, this.spriteSize, 0, [this.spriteRoot+"/left/jumping.gif"]),
	    running_right: new Sprite(this.spriteSize, this.spriteSize, delay, [
	      this.spriteRoot+"/right/running/0.gif",
	      this.spriteRoot+"/right/running/1.gif",
	      this.spriteRoot+"/right/running/2.gif",
	      this.spriteRoot+"/right/running/3.gif"
	    ]),
	    running_left: new Sprite(this.spriteSize, this.spriteSize, delay, [
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
	
	Jumpman.prototype.spriteCenter = function () {
	  return {
	    x: this.pos.x + this.sprite.width/2,
	    y: this.pos.y + this.sprite.height/2
	  };
	};
	
	Jumpman.prototype.updateSprite = function () {
	  if (!this.spriteAction) {
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
	    if (this.invisible) {
	      this.sprite = {draw: function () {}};
	    }
	  }
	};
	
	Jumpman.prototype.xStop = function () {
	  if (this.speed.x > 0) {
	    this.xRightStop();
	  } else {
	    this.xLeftStop();
	  }
	};
	
	Jumpman.prototype.xRightStop = function () {
	  if (this.pos.x%24===0 && this.checkUnderFeet()) {
	    this.speed.x = 0;
	  } else {
	    if (this.speed.x > 0) {
	      setTimeout(this.xRightStop.bind(this), 16);
	    }
	  }
	};
	
	Jumpman.prototype.xLeftStop = function () {
	  if (this.pos.x%24===0 && this.checkUnderFeet()) {
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

	var Util = {
	  universals: {
	    gravity: 1,
	    canvasContext: null,
	    view: null,
	    roomBottomRight: {x: 0, y: 0}
	  },
	};
	
	Array.prototype.mean = function () {
	  var sum = 0;
	  for (var i = 0; i < this.length; i++) {
	    sum += this[i];
	  }
	  return sum/this.length;
	};
	
	Util.level = 1;
	
	Util.inherits = function (ChildClass, BaseClass) {
	  function Surrogate() { this.constructor = ChildClass; }
	  Surrogate.prototype = BaseClass.prototype;
	  ChildClass.prototype = new Surrogate();
	};
	
	Util.ironWalls = function (subject) {
	  if (subject.pos && subject.spriteSize) {
	    if (subject.pos.x > this.universals.roomBottomRight.x) {
	      subject.pos.x = this.universals.roomBottomRight.x;
	    } else if (subject.pos.x < 0) {
	      subject.pos.x = 0;
	    }
	  } else {
	    console.log("Iron walls function not compatible");
	  }
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
	
	  integers[integers.length-1] = integers[integers.length-1] +
	  Math.random()*integers[integers.length-1] -
	  Math.random()*integers[integers.length-1];
	
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
	
	Util.findTypeByProx = function (type, array, pos) {
	  var result;
	  array.forEach(function (mover) {
	    if (mover.type && mover.type === type && !result ) {
	      result = mover;
	    }
	    if (mover.type && mover.type === type &&
	        Util.distanceBetween(mover.pos, pos) <
	        Util.distanceBetween(result.pos, pos)) {
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
	
	// Util.nextLevel is defined in game.js
	
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
	    chaser.facing = "left";
	  } else if (chaser.pos.x < targetPos.x) {
	    chaser.speed.x = speed;
	    chaser.facing = "right";
	  }
	};
	
	module.exports = Util;


/***/ },
/* 7 */
/***/ function(module, exports) {

	blocks = [];
	
	module.exports = blocks;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Sprite = __webpack_require__(3);
	var Util = __webpack_require__(6);
	var Aura = __webpack_require__(9);
	var blocks = __webpack_require__(7);
	var movers = __webpack_require__(10);
	var players = __webpack_require__(11);
	
	var Hammer = function (index, x, y, xspeed, yspeed, throwPower) {
	  this.type = "hammer";
	  this.index = index;
	
	  // constants
	  this.FUDGE = 5;
	  this.MAXSPEED = 30;
	  this.DECAY = 0.1;
	  this.BASESPEED = 22;
	
	  this.attraction = 1.5;
	  this.spriteSize = 48;
	
	  this.pos = {
	    x: x,
	    y: y
	  };
	  this.speed = {
	    x: (xspeed + (this.BASESPEED * throwPower)),
	    y: yspeed
	  };
	  this.accel = {
	    x: 0,
	    y: 0
	  };
	  this.setSprites();
	  this.age = 0;
	  this.soft = 2;
	  this.hexed = false;
	  this.aura = null;
	
	};
	
	Hammer.prototype.act = function () {
	  var xGap = this.pos.x - players[0].pos.x;
	  var yGap = this.pos.y - players[0].pos.y;
	  var distance = Math.sqrt((xGap * xGap) + (yGap * yGap));
	
	  this.accel.x = -(xGap * (this.attraction + (this.age * this.DECAY))) / distance;
	  this.accel.y = -(yGap * (this.attraction + (this.age * 2 * this.DECAY))) / distance;
	
	  this.catchCheck();
	  this.age ++;
	  if (this.soft > 0) {
	    this.soft --;
	  }
	  if (Util.distanceBetween(this.pos, players[0].pos) > 48*10) {
	    this.speed = Util.moveTowards(this.pos, players[0].pos, this.MAXSPEED);
	  }
	  this.checkForHexes();
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
	  ) < players[0].sprite.height + this.FUDGE) {
	    this.destroy();
	    players[0].updateSpriteRoot();
	  }
	};
	
	Hammer.prototype.checkForHexes = function () {
	  if (this.hexed) {
	    if (this.attraction < 1.8) {
	      this.attraction += 0.05;
	    } else {
	      this.hexed = false;
	      this.aura.destroy();
	      this.haywire();
	    }
	  }
	};
	
	Hammer.prototype.destroy = function () {
	  if (this.aura) {
	    this.aura.destroy();
	  }
	  if (this.age > 16) {
	    delete movers[this.index];
	  }
	};
	
	Hammer.prototype.haywire = function () {
	  this.speed.x = (Math.random() * this.maxSpeed * 2) - this.maxSpeed;
	  this.speed.y = (Math.random() * this.maxSpeed * 2) - this.maxSpeed;
	};
	
	Hammer.prototype.hex = function () {
	  this.attraction = -4;
	  this.speed.y = 0;
	  this.speed.x = 0;
	  this.hexed = true;
	  this.aura = new Aura (movers.length, this.pos, "pinkish");
	  movers.push(this.aura);
	};
	
	Hammer.prototype.limitSpeed = function () {
	  var speed = Math.sqrt((this.speed.x * this.speed.x) + (this.speed.y * this.speed.y));
	  if (speed > this.MAXSPEED){
	    var ratio = (this.MAXSPEED / speed);
	    this.speed.x *= ratio;
	    this.speed.y *= ratio;
	  }
	};
	
	Hammer.prototype.move = function () {
	  this.speed.x += this.accel.x;
	  this.speed.y += this.accel.y;
	
	  this.limitSpeed();
	
	  this.pos.x += this.speed.x;
	  this.pos.y += this.speed.y;
	};
	
	Hammer.prototype.ricochet = function () {
	  this.speed.x *= (-0.9);
	  this.speed.y *= (-0.9);
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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var Sprite = __webpack_require__(3);
	var Util = __webpack_require__(6);
	var blocks = __webpack_require__(7);
	var movers = __webpack_require__(10);
	var players = __webpack_require__(11);
	
	var Aura = function (index, subjectPos, color) {
	  this.type = "aura";
	  this.index = index;
	  this.pos = subjectPos;
	  this.color = color;
	  this.setSprites();
	  this.age = 0;
	};
	
	Aura.prototype.act = function () {
	
	};
	
	Aura.prototype.destroy = function () {
	  delete movers[this.index];
	};
	
	Aura.prototype.move = function () {
	
	};
	
	Aura.prototype.setSprites = function () {
	  this.sprite = new Sprite (48, 48, 0, [
	      "auras/" + this.color + "/0.gif",
	      "auras/" + this.color + "/1.gif",
	      "auras/" + this.color + "/2.gif",
	      "auras/" + this.color + "/3.gif",
	    ]
	  );
	};
	
	module.exports = Aura;


/***/ },
/* 10 */
/***/ function(module, exports) {

	movers = [];
	
	module.exports = movers;


/***/ },
/* 11 */
/***/ function(module, exports) {

	players = [];
	
	module.exports = players;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var Sprite = __webpack_require__(3);
	
	var Meter = function (x, y, health) {
	  this.pos = {
	    x: x,
	    y: y
	  };
	  this.depth = 1;
	  this.virtual = true;
	  this.sprite = new Sprite (48, 48, 0, ["tile/up_key.gif"]);
	};
	
	module.exports = Meter;


/***/ },
/* 13 */
/***/ function(module, exports) {

	tiles = [];
	
	module.exports = tiles;


/***/ },
/* 14 */
/***/ function(module, exports) {

	tiles = [];
	
	module.exports = tiles;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var Sprite = __webpack_require__(3);
	var Jumpman = __webpack_require__(5);
	var Boneheap = __webpack_require__(16);
	var Util = __webpack_require__(6);
	var blocks = __webpack_require__(7);
	var metaBlocks = __webpack_require__(20);
	var players = __webpack_require__(11);
	var movers = __webpack_require__(10);
	
	var Skeleton = function (index, x, y, stats) {
	  this.type = "skeleton";
	  this.index = index;
	  this.spriteSize = 48;
	  this.age = 0;
	  this.pos = {
	    x: x,
	    y: y
	  };
	  this.speed = {
	    x: 0,
	    y: 0
	  };
	  this.accel = {
	    x: 0,
	    y: Util.universals.gravity
	  };
	  this.facing = "right";
	  this.frame = "right";
	  this.spriteRoot = "skeleton";
	  this.setSprites(5);
	  this.sprite = this.sprites.standing_right;
	
	  if (stats === undefined) {
	    this.stats = {
	      sightRange: Util.approximately(330),
	      runSpeed: Util.approximately(4),
	      jumpPower: Util.approximately(14),
	      jumpDistance: Util.approximately(1),
	      chasingSkill: Util.approximately(3.5)
	    };
	  } else {
	    this.stats = stats;
	  }
	};
	
	Util.inherits(Skeleton, Jumpman);
	
	Skeleton.prototype.act = function () {
	  this.facing = (this.speed.x < 0 ? "left" : "right");
	  if (this.checkUnderFeet()) {
	    while (Math.abs(this.speed.x) > this.stats.runSpeed*this.stats.jumpDistance) {
	      this.speed.x *= 0.75;
	    }
	    if (Util.distanceBetween(this.pos, players[0].pos) <= this.stats.sightRange) {
	      // Chance of giving chase
	      if (Math.random()*32 <= this.stats.chasingSkill) {
	        Util.xChase(this, players[0].pos, this.stats.runSpeed);
	      }
	      // If the player is about to escape the skeleton's range, higher chance
	      if (Util.distanceBetween(this.pos, players[0].pos) > this.stats.sightRange*0.9) {
	        if (Math.random()*32 <= this.stats.chasingSkill*7) {
	          Util.xChase(this, players[0].pos, this.stats.runSpeed);
	        }
	      }
	    } else {
	      this.wander();
	    }
	    if (this.age < 12) {
	      this.sprite = this.sprites.rising;
	    }
	    if (this.speed.y > 100) {
	      delete movers[this.index];
	    }
	    this.checkForJumpBlock();
	    this.checkForPlayer();
	    this.dodgeHammer();
	  }
	  this.checkForHammer();
	  this.avoidRoomEdge();
	};
	
	Skeleton.prototype.checkForHammer = function () {
	  movers.forEach(function (mover) {
	    if (mover.type === "hammer" &&
	        Util.distanceBetween(this.pos, mover.pos) < this.sprite.height/2 &&
	        mover.soft <= 0) {
	      mover.ricochet();
	      mover.soft = 4;
	      this.shatter();
	    }
	  }.bind(this));
	};
	
	Skeleton.prototype.checkForPlayer = function () {
	  players.forEach(function (player) {
	    if (this.pos.x < player.pos.x+this.sprite.width &&
	      this.pos.x+this.sprite.width > player.pos.x &&
	      this.pos.y < player.pos.y+this.sprite.height &&
	      this.pos.y+this.sprite.width > player.pos.y
	    ) {
	      if (this.checkUnderFeet() && player.checkUnderFeet()) {
	        // Attack the player, animate if it's succesful
	        if (player.skeletonBite()) {
	          this.spriteAction = true;
	          this.sprite = this.sprites["attack_" + this.facing];
	          this.sprite.addAnimationEndCallback(function () {
	            this.spriteAction = false;
	          }.bind(this));
	        }
	      }
	    }
	  }.bind(this));
	};
	
	Skeleton.prototype.checkForJumpBlock = function () {
	  metaBlocks.forEach(function(metaBlock){
	    if (metaBlock && metaBlock.types.includes("horseGate") &&
	        Util.distanceBetween(players[0].pos, metaBlock.pos) < 480) {
	        metaBlock.destroy();
	    }
	    if (metaBlock && this.pos.x < metaBlock.pos.x+this.sprite.width+2 &&
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
	            !(Util.distanceBetween(this.pos, players[0].pos) < this.stats.sightRange &&
	            players[0].pos.x < this.pos.x) &&
	            this.speed.x > 0) {
	              this.jump();
	            }
	          if (metaBlock.types.includes("switchJumpLeft") &&
	            this.pos.y-players[0].pos.y > -48 &&
	            !(Util.distanceBetween(this.pos, players[0].pos) < this.stats.sightRange &&
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
	          if (metaBlock.types.includes("horseGate")) {
	            this.speed.x = 0;
	            this.speed.y = 0;
	          }
	        }
	  }.bind(this));
	};
	
	Skeleton.prototype.dodgeHammer = function () {
	  movers.forEach(function (mover) {
	    if (mover.type === "hammer" &&
	        Math.round(Math.random()*0.8) &&
	        Util.distanceBetween(this.pos, mover.pos) > this.stats.sightRange/5 &&
	        Util.distanceBetween(this.pos, mover.pos) < this.stats.sightRange/3 ) {
	      this.jump();
	    }
	  }.bind(this));
	};
	
	Skeleton.prototype.jump = function () {
	  if (this.checkUnderFeet()) {
	    this.speed.y = 0-this.stats.jumpPower;
	    this.speed.x *= this.stats.jumpDistance;
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
	  this.sprites.attack_left = new Sprite (48, 48, 2, [
	      "skeleton/left/attack/0.gif",
	      "skeleton/left/attack/1.gif",
	      "skeleton/left/attack/2.gif",
	      "skeleton/left/attack/3.gif"
	    ]
	  );
	  this.sprites.attack_right = new Sprite (48, 48, 2, [
	      "skeleton/right/attack/0.gif",
	      "skeleton/right/attack/1.gif",
	      "skeleton/right/attack/2.gif",
	      "skeleton/right/attack/3.gif"
	    ]
	  );
	};
	
	Skeleton.prototype.shatter = function () {
	  movers[this.index] = new Boneheap (this.index, this.pos, this.stats);
	};
	
	Skeleton.prototype.wander = function () {
	  if (Math.random()*256*(Math.abs(this.speed.x)+0.5) < 1) {
	    this.speed.x = this.stats.runSpeed;
	  } else if (Math.random()*128 < 2) {
	    this.speed.x = 0-this.stats.runSpeed;
	  }
	};
	
	module.exports = Skeleton;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var Sprite = __webpack_require__(3);
	var Util = __webpack_require__(6);
	var Jumpman = __webpack_require__(5);
	var blocks = __webpack_require__(7);
	var movers = __webpack_require__(10);
	
	var Boneheap = function (index, pos, stats, spriteRoot) {
	  this.index = index;
	  this.type = "boneheap";
	  if (!spriteRoot) {
	    this.spriteRoot = "boneheap";
	  } else {
	    this.spriteRoot = spriteRoot;
	  }
	  this.age = 0;
	  this.pos = {
	    x: pos.x,
	    y: pos.y
	  };
	  this.speed = {
	    x: 0,
	    y: 0
	  };
	  if (this.speed.y < 0) {
	    this.speed.y = 0;
	  }
	  this.accel = {
	    x: 0,
	    y: Util.universals.gravity
	  };
	
	  if (stats === undefined) {
	    this.stats = {
	      sightRange: Util.approximately(330),
	      runSpeed: Util.approximately(4),
	      jumpPower: Util.approximately(14),
	      jumpDistance: Util.approximately(1),
	      chasingSkill: Util.approximately(3.5)
	    };
	  } else {
	    this.stats = stats;
	  }
	
	  this.setSprites();
	};
	
	Boneheap.prototype.move = function () {
	  this.pos.x += this.speed.x;
	  this.pos.y += this.speed.y;
	  this.speed.x += this.accel.x;
	  this.speed.y += this.accel.y;
	  this.landUnderFeet();
	};
	
	Boneheap.prototype.act = function () {
	  this.age ++;
	  if (this.age === this.collapseSprite.frames.length) {
	    this.sprite = this.staticSprite;
	  }
	};
	
	Boneheap.prototype.landUnderFeet = Jumpman.prototype.landUnderFeet;
	
	Boneheap.prototype.landOnGround = Jumpman.prototype.landOnGround;
	
	Boneheap.prototype.reanimate = function () {
	  var Skeleton = __webpack_require__(15);
	  var Burningman = __webpack_require__(17);
	  if (this.spriteRoot === "boneheap") {
	    movers[this.index] = (new Skeleton (this.index, this.pos.x, this.pos.y, this.stats));
	  } else if (this.spriteRoot === "burningman/boneheap") {
	    var newBurner = (new Burningman (this.index, this.pos.x, this.pos.y, this.stats));
	    movers[this.index] = newBurner;
	    newBurner.age = 2;
	  }
	};
	
	Boneheap.prototype.setSprites = function () {
	  this.collapseSprite = new Sprite (48, 48, 0, [
	      this.spriteRoot+"/collapsing/0.gif",
	      this.spriteRoot+"/collapsing/1.gif",
	      this.spriteRoot+"/collapsing/2.gif",
	      this.spriteRoot+"/collapsing/3.gif"
	    ]
	  );
	  this.staticSprite = new Sprite (48, 48, 0, [
	      this.spriteRoot+"/heap.gif"
	    ]
	  );
	  this.sprite = this.collapseSprite;
	};
	
	module.exports = Boneheap;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var Sprite = __webpack_require__(3);
	var Jumpman = __webpack_require__(5);
	var Boneheap = __webpack_require__(16);
	var Skeleton = __webpack_require__(15);
	var Pyre = __webpack_require__(18);
	var Fireball = __webpack_require__(19);
	var Util = __webpack_require__(6);
	var blocks = __webpack_require__(7);
	var metaBlocks = __webpack_require__(20);
	var players = __webpack_require__(11);
	var movers = __webpack_require__(10);
	
	var Burningman = function (index, x, y, stats) {
	  this.type = "burningman";
	  this.index = index;
	  this.spriteSize = 48;
	  this.age = 0;
	  this.pos = {
	    x: x,
	    y: y
	  };
	  this.speed = {
	    x: 0,
	    y: 0
	  };
	  this.accel = {
	    x: 0,
	    y: Util.universals.gravity
	  };
	  this.facing = "right";
	  this.spriteRoot = "burningman";
	  this.setSprites(5);
	  this.sprite = this.sprites.standing_right;
	  this.fireballDelay = 16;
	
	  if (stats === undefined) {
	    this.stats = {
	      sightRange: Util.approximately(330),
	      runSpeed: Util.approximately(4),
	      jumpPower: Util.approximately(11),
	      jumpDistance: 1,
	      chasingSkill: 3,
	      throwPower: Util.approximately(9)
	    };
	  } else {
	    this.stats = stats;
	  }
	};
	
	Util.inherits(Burningman, Jumpman);
	
	Burningman.prototype.act = function () {
	  this.checkForHammer();
	  this.checkForPlayer();
	  this.avoidRoomEdge();
	  this.fireballDecision();
	  this.jumpAtArcPeak();
	  this.dodgeHammer();
	  if (!this.pyre && !Math.floor(Math.random()*256) || this.age === 1) {
	    this.ignite();
	  }
	  if (Util.distanceBetween(this.pos, players[0].pos) <= this.stats.sightRange) {
	    if (Math.random()*32 <= this.stats.chasingSkill) {
	      Util.xChase(this, players[0].pos, this.stats.runSpeed);
	    }
	  }
	  this.checkForJumpBlock();
	};
	
	Burningman.prototype.conjureFire = function () {
	  if (this.pyre) {
	    this.pyre.spriteAction = true;
	    this.pyre.sprite = this.pyre.sprites.conjuring;
	    this.pyre.sprite.addAnimationEndCallback(function () {
	      this.pyre.spriteAction = false;
	      this.throwFireball();
	    }.bind(this));
	  }
	};
	
	Burningman.prototype.checkForHammer = function () {
	  movers.forEach(function (mover) {
	    if (mover.type === "hammer" &&
	        Util.distanceBetween(this.pos, mover.pos) < this.sprite.height/2 &&
	        mover.soft <= 0) {
	      mover.ricochet();
	      mover.soft = 4;
	      this.shatter();
	    }
	  }.bind(this));
	};
	
	Burningman.prototype.checkForPlayer = Skeleton.prototype.checkForPlayer;
	
	Burningman.prototype.checkForJumpBlock = Skeleton.prototype.checkForJumpBlock;
	
	Burningman.prototype.dodgeHammer = function () {
	  movers.forEach(function (mover) {
	    if (mover.type === "hammer" &&
	        Math.round(Math.random()*0.8) &&
	        Util.distanceBetween(this.pos, mover.pos) > this.stats.sightRange/9 &&
	        Util.distanceBetween(this.pos, mover.pos) < this.stats.sightRange/2 ) {
	      this.jump();
	    }
	  }.bind(this));
	};
	
	Burningman.prototype.predictPos = function (mover, steps) {
	  var predictX = mover.pos.x + mover.speed.x * steps;
	  var predictY = mover.pos.y + mover.speed.y * steps;
	  return {
	    x: predictX,
	    y: predictY
	  };
	};
	
	Burningman.prototype.fireballDecision = function () {
	  if (Math.abs(this.predictPos(this, this.fireballDelay).y - this.predictPos(players[0], this.fireballDelay).y) < 48 &&
	  Math.abs(this.predictPos(this, this.fireballDelay).x - this.predictPos(players[0], this.fireballDelay).x) < 48*8 &&
	  (!Math.floor(Math.random()*48) || !this.checkUnderFeet())) {
	    this.conjureFire();
	  }
	};
	
	Burningman.prototype.fireJump = function () {
	  if (this.pyre) {
	    this.pyre.spriteAction = true;
	    this.pyre.sprite = this.pyre.sprites.jump_burst;
	    this.pyre.sprite.addAnimationEndCallback(function () {
	      this.pyre.spriteAction = false;
	      this.actuallyJump();
	    }.bind(this));
	  }
	};
	
	Burningman.prototype.ignite = function () {
	  this.pyre = new Pyre (movers.length, this);
	  this.stats.runSpeed = Math.abs(this.stats.runSpeed);
	  movers.push(this.pyre);
	};
	
	Burningman.prototype.actuallyJump = function () {
	  this.speed.y = 0-this.stats.jumpPower;
	  this.speed.x *= this.stats.jumpDistance;
	};
	
	Burningman.prototype.jumpAtArcPeak = function () {
	  if (!this.checkUnderFeet() &&
	  Math.abs(this.speed.y) < 1 &&
	  this.pos.y > players[0].pos.y-48*2) {
	    this.jump();
	  }
	};
	
	Burningman.prototype.jump = function () {
	  if (this.checkUnderFeet()) {
	    this.actuallyJump();
	  } else {
	    this.fireJump();
	  }
	};
	
	Burningman.prototype.setExtraSprites = function () {
	  this.sprites.rising = new Sprite (48, 48, 2, [
	      "burningman/boneheap/collapsing/3.gif",
	      "burningman/boneheap/collapsing/2.gif",
	      "burningman/boneheap/collapsing/1.gif",
	      "burningman/boneheap/collapsing/0.gif"
	    ]
	  );
	  this.sprites.attack_left = new Sprite (48, 48, 2, [
	      "burningman/left/attack/0.gif",
	      "burningman/left/attack/1.gif",
	      "burningman/left/attack/2.gif",
	      "burningman/left/attack/3.gif"
	    ]
	  );
	  this.sprites.attack_right = new Sprite (48, 48, 2, [
	      "burningman/right/attack/0.gif",
	      "burningman/right/attack/1.gif",
	      "burningman/right/attack/2.gif",
	      "burningman/right/attack/3.gif"
	    ]
	  );
	};
	
	Burningman.prototype.shatter = function () {
	  if (this.pyre) {
	    this.pyre.destroy();
	    this.pyre = null;
	    this.stats.runSpeed *= -0.92;
	  } else {
	    movers[this.index] = new Boneheap (this.index, this.pos, this.stats, "burningman/boneheap");
	  }
	};
	
	Burningman.prototype.throwFireball = function () {
	  if (this.pyre) {
	    this.speed.x = 0;
	    movers.push(new Fireball (movers.length, this.pos, this.facing ==="right" ? this.stats.throwPower : 0-this.stats.throwPower));
	  }
	};
	
	Burningman.prototype.wander = function () {
	  if (!Math.floor(Math.random()*96) &&
	  this.pos.x > Util.universals.roomBottomRight.x/2) {
	    this.speed.x = 0-this.runSpeed;
	  } else {
	    this.speed.x = this.runSpeed;
	  }
	};
	
	module.exports = Burningman;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var Sprite = __webpack_require__(3);
	var Util = __webpack_require__(6);
	var movers = __webpack_require__(10);
	
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


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var Sprite = __webpack_require__(3);
	var Util = __webpack_require__(6);
	var Aura = __webpack_require__(9);
	var blocks = __webpack_require__(7);
	var movers = __webpack_require__(10);
	var players = __webpack_require__(11);
	
	var Fireball = function (index, pos, xspeed) {
	  this.type = "fireball";
	  this.index = index;
	  this.age = 0;
	  this.spriteSize = 48;
	  this.pos = Object.assign( {}, pos);
	  this.pos.y = Math.round(this.pos.y/48) * 48;
	  this.speed = {
	    x: xspeed,
	    y: 0
	  };
	  this.setSprites();
	  this.age = 0;
	};
	
	Fireball.prototype.act = function () {
	  this.checkForPlayer();
	  this.age ++;
	  if (this.age > 64) {
	    this.burst();
	  }
	};
	
	Fireball.prototype.burst = function () {
	  this.sprite = this.sprites.pop;
	  this.sprite.addAnimationEndCallback(function () {
	    this.destroy();
	  }.bind(this));
	};
	
	Fireball.prototype.checkForPlayer = function () {
	  players.forEach(function (player) {
	    if (this.pos.x < player.pos.x+this.sprite.width+2 &&
	      this.pos.x > player.pos.x-2 &&
	      this.pos.y < player.pos.y+this.sprite.height+2 &&
	      this.pos.y > player.pos.y-2
	    ) {
	      player.fireballBite();
	      this.burst();
	    }
	  }.bind(this));
	};
	
	Fireball.prototype.destroy = function () {
	  delete movers[this.index];
	};
	
	Fireball.prototype.move = function () {
	  this.pos.x += this.speed.x;
	  this.pos.y += this.speed.y;
	};
	
	Fireball.prototype.ricochet = function () {
	  this.speed.x *= (-1);
	  this.speed.y *= (-1);
	};
	
	Fireball.prototype.setSprites = function () {
	  this.sprites = {};
	  this.sprites.leftSprite = new Sprite (48, 48, 1, [
	      "burningman/fireball/left/0.gif",
	      "burningman/fireball/left/1.gif",
	      "burningman/fireball/left/2.gif",
	      "burningman/fireball/left/3.gif",
	      "burningman/fireball/left/4.gif",
	      "burningman/fireball/left/5.gif",
	      "burningman/fireball/left/6.gif"
	    ]
	  );
	  this.sprites.rightSprite = new Sprite (48, 48, 1, [
	      "burningman/fireball/right/0.gif",
	      "burningman/fireball/right/1.gif",
	      "burningman/fireball/right/2.gif",
	      "burningman/fireball/right/3.gif",
	      "burningman/fireball/right/4.gif",
	      "burningman/fireball/right/5.gif",
	      "burningman/fireball/right/6.gif"
	    ]
	  );
	  this.sprites.pop = new Sprite (48, 48, 1, [
	      "burningman/fireball/pop/0.gif",
	      "burningman/fireball/pop/1.gif",
	      "burningman/fireball/pop/2.gif",
	      "burningman/fireball/pop/3.gif"
	    ]
	  );
	  this.sprite = this.speed.x > 0 ? this.sprites.rightSprite : this.sprites.leftSprite;
	};
	
	module.exports = Fireball;


/***/ },
/* 20 */
/***/ function(module, exports) {

	metaBlocks = [];
	
	module.exports = metaBlocks;


/***/ },
/* 21 */
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
/* 22 */
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
/* 23 */
/***/ function(module, exports) {

	var keyEvents = function (document, player) {
	  document.onkeydown = function (e) {
	    switch(e.keyCode) {
	    case 68: // d
	    case 39: //right
	      if (player.checkUnderFeet() && !player.dead) {
	        player.speed.x = player.stats.runSpeed;
	      }
	      player.facing = "right";
	      break;
	    case 65: // a
	    case 37: //left
	      if (player.checkUnderFeet() && !player.dead) {
	        player.speed.x = 0-player.stats.runSpeed;
	      }
	      player.facing = "left";
	      break;
	    case 87: // w
	    case 38: //up
	      if (player.checkUnderFeet() && !player.dead) {
	        player.upKey();
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
/* 24 */
/***/ function(module, exports) {

	trains = [];
	
	module.exports = trains;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(6);
	var trains = __webpack_require__(24);
	var movers = __webpack_require__(10);
	
	var Conductor = function (zone) {
	  this.zone = zone;
	  this.trains = trains;
	  this.movers = movers;
	  this.time = 0;
	};
	
	Conductor.prototype.manageTrains = function () {
	  switch (this.zone.name) {
	    case "Throop":
	      var ACar = __webpack_require__(26);
	      if (Util.typeCount("skeleton", this.movers) === 0 &&
	      Util.typeCount("burningman", this.movers) === 0 &&
	      Util.typeCount("shoggoth", this.movers) === 0) {
	        if (Util.typeCount("aCar", this.trains) === 0) {
	          this.trains.push(new ACar (trains.length, "front", -1300, this.zone.trainY-100, 26, -0.1, this));
	          this.trains.push(new ACar (trains.length, "middle", -1540, this.zone.trainY-100, 26, -0.1, this));
	          this.trains.push(new ACar (trains.length, "middle", -1780, this.zone.trainY-100, 26, -0.1, this));
	          this.trains.push(new ACar (trains.length, "middle", -2020, this.zone.trainY-100, 26, -0.1, this));
	          this.trains.push(new ACar (trains.length, "middle", -2260, this.zone.trainY-100, 26, -0.1, this));
	          this.trains.push(new ACar (trains.length, "rear", -2500, this.zone.trainY-100, 26, -0.1, this));
	        }
	      }
	    break;
	  }
	};
	
	Conductor.prototype.departTrains = function () {
	  var departed = false;
	  for (var o = 0; o < this.trains.length; o++) {
	    if (this.trains[o].doors) {
	      this.trains[o].doors.close();
	    }
	    if (!departed) {
	      departed = true;
	      setTimeout(function () {
	        Util.nextLevel();
	      }, 4800);
	    }
	  }
	};
	
	module.exports = Conductor;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(6);
	var Sprite = __webpack_require__(3);
	var Doors = __webpack_require__(27);
	
	var A = function (index, carType, x, y, xSpeed, xAccel, conductor) {
	  this.index = index;
	  this.type = "aCar";
	  this.spriteHeight = 100;
	  this.spriteWidth = 240;
	  this.carType = carType;
	  this.entering = true;
	  this.conductor = conductor;
	  this.pos = {
	    x: x,
	    y: y
	  };
	  this.speed = {
	    x: xSpeed,
	    y: 0
	  };
	  this.accel = {
	    x: xAccel,
	    y: 0
	  };
	  this.doors = null;
	  this.setSprites();
	};
	
	A.prototype.move = function () {
	  this.speed.x += this.accel.x;
	  this.speed.y += this.accel.y;
	  if (this.entering && this.speed.x < 0) {
	    this.speed.x = 0;
	  }
	  this.pos.x += this.speed.x;
	  this.pos.y += this.speed.y;
	};
	
	A.prototype.act = function () {
	  if (this.speed.x === 0 && Util.typeCount("doors", trains) < Util.typeCount("aCar", trains)) {
	    this.doors = new Doors (trains.length, this.pos, this);
	    trains.push(this.doors);
	  }
	};
	
	A.prototype.setSprites = function () {
	  switch (this.carType) {
	    case "front":
	      this.sprite = new Sprite (this.spriteWidth, this.spriteHeight, 0, ["trains/A/cars/front.gif"]);
	    break;
	    case "middle":
	      this.sprite = new Sprite (this.spriteWidth, this.spriteHeight, 0, ["trains/A/cars/middle.gif"]);
	    break;
	    case "rear":
	      this.sprite = new Sprite (this.spriteWidth, this.spriteHeight, 0, ["trains/A/cars/rear.gif"]);
	    break;
	  }
	};
	
	module.exports = A;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(6);
	var Sprite = __webpack_require__(3);
	var players = __webpack_require__(11);
	var trains = __webpack_require__(24);
	
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
	      players[0].pos.x + players[0].spriteSize > this.pos.x + 24+24 &&
	      players[0].pos.x < this.pos.x + 58-24 &&
	      players[0].pos.y > this.pos.y) ||
	      (
	      //Right Door
	      players[0].pos.x + players[0].spriteSize > this.pos.x + 186+24 &&
	      players[0].pos.x < this.pos.x + 220-24 &&
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


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./background": 29,
		"./background.js": 29,
		"./backgrounds/junctionBricks": 31,
		"./backgrounds/junctionBricks.js": 31,
		"./backgrounds/throopBricks": 33,
		"./backgrounds/throopBricks.js": 33,
		"./backgrounds/throopPillars": 34,
		"./backgrounds/throopPillars.js": 34,
		"./keyEvents": 23,
		"./keyEvents.js": 23,
		"./objectArrays/blocks": 7,
		"./objectArrays/blocks.js": 7,
		"./objectArrays/metaBlocks": 20,
		"./objectArrays/metaBlocks.js": 20,
		"./objectArrays/movers": 10,
		"./objectArrays/movers.js": 10,
		"./objectArrays/overlays": 14,
		"./objectArrays/overlays.js": 14,
		"./objectArrays/players": 11,
		"./objectArrays/players.js": 11,
		"./objectArrays/tiles": 13,
		"./objectArrays/tiles.js": 13,
		"./objectArrays/trains": 24,
		"./objectArrays/trains.js": 24,
		"./objects/aura": 9,
		"./objects/aura.js": 9,
		"./objects/block": 21,
		"./objects/block.js": 21,
		"./objects/boneheap": 16,
		"./objects/boneheap.js": 16,
		"./objects/burningman": 17,
		"./objects/burningman.js": 17,
		"./objects/fireball": 19,
		"./objects/fireball.js": 19,
		"./objects/hammer": 8,
		"./objects/hammer.js": 8,
		"./objects/jumpman": 5,
		"./objects/jumpman.js": 5,
		"./objects/metaBlock": 35,
		"./objects/metaBlock.js": 35,
		"./objects/meter": 4,
		"./objects/meter.js": 4,
		"./objects/pigeon": 36,
		"./objects/pigeon.js": 36,
		"./objects/player": 2,
		"./objects/player.js": 2,
		"./objects/pyre": 18,
		"./objects/pyre.js": 18,
		"./objects/shoggoth": 38,
		"./objects/shoggoth.js": 38,
		"./objects/skeleton": 15,
		"./objects/skeleton.js": 15,
		"./objects/sparks": 39,
		"./objects/sparks.js": 39,
		"./objects/tile": 30,
		"./objects/tile.js": 30,
		"./objects/trains/aCar": 26,
		"./objects/trains/aCar.js": 26,
		"./objects/trains/conductor": 25,
		"./objects/trains/conductor.js": 25,
		"./objects/trains/doors": 27,
		"./objects/trains/doors.js": 27,
		"./objects/upKey": 12,
		"./objects/upKey.js": 12,
		"./objects/view": 22,
		"./objects/view.js": 22,
		"./objects/wizard": 37,
		"./objects/wizard.js": 37,
		"./renderZone": 1,
		"./renderZone.js": 1,
		"./sprite": 3,
		"./sprite.js": 3,
		"./util/util": 6,
		"./util/util.js": 6,
		"./zone": 40,
		"./zone.js": 40,
		"./zones/blank": 41,
		"./zones/blank.js": 41,
		"./zones/extras/burningMan": 42,
		"./zones/extras/burningMan.js": 42,
		"./zones/extras/buster": 43,
		"./zones/extras/buster.js": 43,
		"./zones/extras/shoggothBrawl": 44,
		"./zones/extras/shoggothBrawl.js": 44,
		"./zones/extras/subwayPlatform": 45,
		"./zones/extras/subwayPlatform.js": 45,
		"./zones/extras/tooManyCooks": 46,
		"./zones/extras/tooManyCooks.js": 46,
		"./zones/extras/zoneOne": 47,
		"./zones/extras/zoneOne.js": 47,
		"./zones/junction": 48,
		"./zones/junction.js": 48,
		"./zones/throop": 49,
		"./zones/throop.js": 49
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 28;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var Tile = __webpack_require__(30);
	
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
/* 30 */
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
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var Background = __webpack_require__(29);
	var Sprite = __webpack_require__(3);
	
	var throopBricks = new Background ([
	  "-----------------------------",
	  "-----------------------------",
	  "====================---------",
	  "=====================--------",
	  "======================-------",
	  "=======================------",
	  "========================-----",
	  "=========================----",
	  "==========================---",
	  "===========================--",
	  "============================-"
	],
	{
	  "-": {sprite: new Sprite (48, 48, 0, ["tile/night_sky.gif"]),
	        depth: 5},
	  "=": {sprite: new Sprite (48, 48, 0, ["tile/brick_red.gif"]),
	        depth: 5}
	});
	
	module.exports = throopBricks;


/***/ },
/* 32 */,
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var Background = __webpack_require__(29);
	var Sprite = __webpack_require__(3);
	
	var throopBricks = new Background ([
	  "-------------------------------------",
	  "-------------------------------------",
	  "-------------------------------------",
	  "-------------------------------------",
	  "-------------------------------------",
	  "=====================================",
	  "-------------------------------------",
	  "-------------------------------------",
	  "-------------------------------------",
	  "=====================================",
	  "====================================="
	],
	{
	  "-": {sprite: new Sprite (48, 48, 0, ["tile/brick_light.gif"]),
	        depth: 5},
	  "=": {sprite: new Sprite (48, 48, 0, ["tile/brick_dark.gif"]),
	        depth: 5}
	});
	
	module.exports = throopBricks;


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var Background = __webpack_require__(29);
	var Sprite = __webpack_require__(3);
	
	var throopPillars = new Background ([
	  "=====================================================",
	  "=====================================================",
	  "=====================================================",
	  "FFFL FFFFL FFFFL FFFFL FFFFL FFFFL FFFFL FFFFL FFFFL ",
	  "    I     I     I     I     I     I     I     I     I",
	  "    I     I     I  K  I     I     I     I     I     I",
	  "    I     I     I     I     I     I     I     I     I",
	  "    I     I     I     I     I     I     I     I     I",
	  "    I     I     I     I     I     I     I     I     I",
	  "    I     I     I     I     I     I     I     I     I",
	  "    I     I     I     I     I     I     I     I     I"
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
	  "K": {sprite: new Sprite (96, 48, 0, ["tile/sign_kthroop.gif"]),
	        depth: 5}
	});
	
	module.exports = throopPillars;


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var Sprite = __webpack_require__(3);
	var metaBlocks = __webpack_require__(20);
	
	var MetaBlock = function (index, x, y, types) {
	  this.index = index;
	  this.pos = {
	    x: x,
	    y: y
	  };
	  this.types = types;
	};
	
	MetaBlock.prototype.destroy = function () {
	  delete metaBlocks[this.index];
	};
	
	module.exports = MetaBlock;


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var Sprite = __webpack_require__(3);
	var Jumpman = __webpack_require__(5);
	var Boneheap = __webpack_require__(16);
	var Util = __webpack_require__(6);
	var blocks = __webpack_require__(7);
	var metaBlocks = __webpack_require__(20);
	var players = __webpack_require__(11);
	var movers = __webpack_require__(10);
	
	var Pigeon = function (index, x, y, stats) {
	  this.type = "pigeon";
	  this.index = index;
	  this.spriteSize = 48;
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
	
	  if (stats === undefined) {
	    this.stats = {
	      sightRange: Util.approximately(270),
	      runSpeed: Util.approximately(4),
	      jumpPower: Util.approximately(18),
	      jumpDistance: Util.approximately(1.4),
	      chasingSkill: Util.approximately(2),
	      magicRange: Util.approximately(72),
	      castingDelay: Util.approximately(18)
	    };
	  } else {
	    this.stats = stats;
	  }
	
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
	  } else if (this.age === 18) {
	    this.spriteRoot = "pigeon";
	    this.setSprites(2);
	  }
	};
	
	Pigeon.prototype.checkForBoneheap = function () {
	  var boneheap = Util.findTypeByProx("boneheap", movers, this.pos);
	  var hammer = Util.findByType("hammer", movers);
	  if (boneheap && Util.distanceBetween(this.pos, boneheap.pos) < this.stats.sightRange &&
	      !(hammer &&
	      Util.distanceBetween(this.pos, hammer.pos) > this.stats.sightRange/12 &&
	      Util.distanceBetween(this.pos, hammer.pos) < this.stats.sightRange/2 )
	    ) {
	    this.xStop();
	    this.speed.y = 0;
	    this.turnIntoAPerson();
	  }
	};
	
	Pigeon.prototype.checkForHammer = function () {
	  movers.forEach(function (mover) {
	    if (mover.type === "hammer" &&
	        Util.distanceBetween(this.pos, mover.pos) < this.sprite.height/2 &&
	        mover.soft <= 0) {
	      mover.ricochet();
	      mover.soft = 8;
	      this.transmogrify(true);
	    }
	  }.bind(this));
	};
	
	Pigeon.prototype.act = function () {
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
	    if (hammer && Util.distanceBetween(this.pos, hammer.pos) < this.stats.sightRange) {
	      this.dodgeHammer();
	    }
	  }
	  if (Util.typeCount("boneheap", movers) > 0 && Math.random()*64 < 1) {
	    var boneheap = Util.findTypeByProx("boneheap", movers, this.pos);
	    Util.xChase(this, boneheap.pos, this.stats.runSpeed);
	  }
	  this.checkForHammer();
	  this.checkForBoneheap();
	};
	
	Pigeon.prototype.dodgeHammer = function () {
	  var hammer = Util.findByType("hammer", movers);
	  var boneheap = Util.findTypeByProx("boneheap", movers, this.pos);
	  if (Math.round(Math.random())) {
	    this.jump();
	  }
	  this.speed.x = this.pos.x > hammer.pos.x ? this.stats.runSpeed : 0-this.stats.runSpeed;
	  if (boneheap && !Math.round(Math.random()*2)) {
	    this.speed.x = this.pos.x < boneheap.pos.x ? this.stats.runSpeed : 0-this.stats.runSpeed;
	  }
	};
	
	Pigeon.prototype.jump = function () {
	  this.speed.y = 0-this.stats.jumpPower/3;
	};
	
	Pigeon.prototype.setExtraSprites = function () {
	  this.sprites.jumping_right = this.sprites.running_right;
	  this.sprites.jumping_left = this.sprites.running_left;
	};
	
	Pigeon.prototype.transmogrify = function (kill) {
	  var Wizard = __webpack_require__(37);
	  var wizard = new Wizard (this.index, this.pos.x, this.pos.y, this.stats);
	  movers[this.index] = wizard;
	  if (kill) {
	    wizard.die();
	  }
	};
	
	Pigeon.prototype.turnIntoAPerson = function () {
	  if (this.age > 48) {
	    this.transmogrify();
	  }
	};
	
	Pigeon.prototype.wander = function () {
	  if (!Math.floor(Math.random()*128)) {
	    this.facing = this.facing === "right" ? "left" : "right";
	    this.xStop();
	  }
	};
	
	module.exports = Pigeon;


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var Sprite = __webpack_require__(3);
	var Jumpman = __webpack_require__(5);
	var Boneheap = __webpack_require__(16);
	var Util = __webpack_require__(6);
	var blocks = __webpack_require__(7);
	var metaBlocks = __webpack_require__(20);
	var players = __webpack_require__(11);
	var movers = __webpack_require__(10);
	
	var Wizard = function (index, x, y, stats) {
	  this.type = "wizard";
	  this.index = index;
	  this.spriteSize = 48;
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
	
	  if (stats === "undefined") {
	    this.stats = {
	      sightRange: Util.approximately(270),
	      runSpeed: Util.approximately(5),
	      jumpPower: Util.approximately(18),
	      jumpDistance: Util.approximately(1.6),
	      chasingSkill: Util.approximately(2),
	      magicRange: Util.approximately(96),
	      castingDelay: Util.approximately(18)
	    };
	  } else {
	    this.stats = stats;
	  }
	
	  this.age = 0;
	  this.casting = false;
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
	  var boneheap = Util.findTypeByProx("boneheap", movers, this.pos);
	  if (boneheap && Util.distanceBetween(this.pos, boneheap.pos) < this.stats.magicRange) {
	    this.speed.x = 0;
	    this.casting = true;
	    if (this.sprites.casting_right && !this.dying && this.checkUnderFeet()) {
	      this.sprite = (boneheap.pos.x > this.pos.x) ? this.sprites.casting_right : this.sprites.casting_left;
	    }
	    if (this.casting && !this.dying && !Math.round(Math.random()*this.stats.castingDelay)) {
	      boneheap.reanimate(this.index, this.pos.x, this.pos.y);
	      this.casting = false;
	      this.sprite = this.facing === "right" ? this.sprites.standing_right : this.sprites.standing_left;
	    }
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
	            !(Util.distanceBetween(this.pos, players[0].pos) < this.stats.sightRange &&
	            players[0].pos.x < this.pos.x) &&
	            this.speed.x > 0) {
	              this.jump();
	            }
	          if (metaBlock.types.includes("switchJumpLeft") &&
	            this.pos.y-players[0].pos.y > -48 &&
	            !(Util.distanceBetween(this.pos, players[0].pos) < this.stats.sightRange &&
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
	  this.speed.y = 0;
	  movers[this.index] = new Boneheap (this.index, this.pos);
	};
	
	Wizard.prototype.act = function () {
	  this.animateTransformation();
	  this.facing = (this.speed.x < 0 ? "left" : "right");
	  if (this.checkUnderFeet()) {
	    while (Math.abs(this.speed.x) > this.stats.runSpeed*this.stats.jumpDistance) {
	      this.speed.x *= 0.75;
	    }
	    var boneheap = Util.findTypeByProx("boneheap", movers, this.pos);
	    if (boneheap) {
	      // Chance of going after a heap
	      if (Math.random()*32 <= this.stats.chasingSkill) {
	        Util.xChase(this, boneheap.pos, this.stats.runSpeed);
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
	    Util.distanceBetween(this.pos, mover.pos) > this.stats.sightRange/24 &&
	    Util.distanceBetween(this.pos, mover.pos) < this.stats.sightRange/2 &&
	    !Math.round(Math.random())) {
	      this.lowJump();
	      if (!Math.round(Math.random())) {
	        this.turnIntoABird();
	      }
	    }
	  }.bind(this));
	  if (Util.distanceBetween(this.pos, players[0].pos) > this.stats.sightRange/24 &&
	      Util.distanceBetween(this.pos, players[0].pos) < this.stats.sightRange/3 &&
	      !Math.round(Math.random()*32)) {
	    Util.xChase(this, players[0].pos, 0-this.runSpeed);
	  }
	};
	
	Wizard.prototype.jump = function () {
	  if (this.checkUnderFeet()) {
	    this.speed.y = 0-this.stats.jumpPower;
	    this.speed.x *= this.stats.jumpDistance;
	    if (this.pos.x < 48*5 && this.speed.x < 0) {
	      this.speed.x *= (-1);
	    }
	  }
	};
	
	Wizard.prototype.lowJump = function () {
	  if (this.checkUnderFeet()) {
	    this.speed.y = 0-this.stats.jumpPower/1.3;
	    this.speed.x *= this.stats.jumpDistance;
	    if (this.pos.x < 48*5 && this.speed.x < 0) {
	      this.speed.x *= (-1);
	    }
	  }
	  this.speed.x = Math.round(Math.random()) ? this.stats.runSpeed : 0-this.stats.runSpeed;
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
	  if (this.spriteRoot === "wizard") {
	    this.sprites.casting_left = new Sprite(48, 48, 3, [
	      this.spriteRoot+"/left/casting/0.gif",
	      this.spriteRoot+"/left/casting/1.gif",
	      this.spriteRoot+"/left/casting/2.gif",
	      this.spriteRoot+"/left/casting/3.gif",
	      this.spriteRoot+"/left/casting/4.gif",
	    ]);
	    this.sprites.casting_right = new Sprite(48, 48, 3, [
	      this.spriteRoot+"/right/casting/0.gif",
	      this.spriteRoot+"/right/casting/1.gif",
	      this.spriteRoot+"/right/casting/2.gif",
	      this.spriteRoot+"/right/casting/3.gif",
	      this.spriteRoot+"/right/casting/4.gif",
	    ]);
	  }
	};
	
	Wizard.prototype.transmogrify = function () {
	  var Pigeon = __webpack_require__(36);
	  movers[this.index] = new Pigeon (this.index, this.pos.x, this.pos.y, this.stats);
	};
	
	Wizard.prototype.turnIntoABird = function () {
	  if (this.age > 21 && !this.dying) {
	    this.transmogrify();
	  }
	};
	
	Wizard.prototype.wander = function () {
	  if (Math.random()*256*(Math.abs(this.speed.x)+0.5) < 1) {
	    this.speed.x = this.stats.runSpeed;
	  } else if (Math.random()*128 < 2) {
	    this.speed.x = 0-this.stats.runSpeed;
	  }
	};
	
	module.exports = Wizard;


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var Sprite = __webpack_require__(3);
	var Jumpman = __webpack_require__(5);
	var Boneheap = __webpack_require__(16);
	var Util = __webpack_require__(6);
	var Sparks = __webpack_require__(39);
	var blocks = __webpack_require__(7);
	var metaBlocks = __webpack_require__(20);
	var players = __webpack_require__(11);
	var movers = __webpack_require__(10);
	
	var Shoggoth = function (index, x, y, stats) {
	  this.type = "shoggoth";
	  this.index = index;
	  this.spriteSize = 72;
	  this.age = 0;
	  this.pos = {
	    x: x,
	    y: y
	  };
	  this.speed = {
	    x: 0,
	    y: 0
	  };
	  this.accel = {
	    x: 0,
	    y: Util.universals.gravity
	  };
	  this.facing = "left";
	  this.spriteRoot = "shoggoth";
	  this.setSprites(3);
	  this.casting = 0;
	  this.scared = 0;
	  this.sprite = this.sprites.standing_left;
	  this.blind = false;
	
	  if (stats === undefined) {
	    this.startingRunSpeed = Util.approximately(2);
	    this.stats = {
	      sightRange: Util.approximately(420),
	      runSpeed: this.startingRunSpeed,
	      jumpPower: Util.approximately(4),
	      castingRange: Util.approximately(420),
	      castingEndurance: Util.approximately(72),
	      chasingSkill: Util.approximately(3.5),
	      shieldRange: 48*4,
	    };
	  } else {
	    this.stats = stats;
	  }
	};
	
	Util.inherits(Shoggoth, Jumpman);
	
	Shoggoth.prototype.act = function () {
	  this.watchForHammer();
	  this.checkForHammer();
	  this.checkForPlayer();
	  if (this.casting > 0) {
	    this.casting --;
	  }
	  if (this.scared > 0) {
	    this.scared --;
	  }
	  if (this.scared === 1) {
	    this.stats.runSpeed = this.startingRunSpeed;
	  }
	  if (this.scared && this.sparks) {
	    this.sparks.destroy();
	  }
	  if (!this.blind && !this.casting && Math.random()*32 <= this.stats.chasingSkill) {
	    Util.xChase(this, players[0].pos, this.stats.runSpeed);
	  }
	  if (Util.distanceBetween(this.spriteCenter(), players[0].spriteCenter()) < this.stats.castingRange &&
	      !this.blind &&
	      !this.scared &&
	      !this.casting &&
	      Math.random()*32 <= this.stats.chasingSkill/8) {
	    this.closeEye();
	  }
	  this.updateSprite();
	  this.avoidRoomEdge();
	  this.checkForJumpBlock();
	};
	
	Shoggoth.prototype.cast = function () {
	  this.speed.x = 0;
	  this.casting = 96;
	  var sparksPos = {
	    x: this.facing === "left" ? this.pos.x - 48 : this.pos.x + 48,
	    y: this.pos.y + 12
	  };
	  this.sparks = new Sparks(movers.length, sparksPos, this);
	  movers.push(this.sparks);
	};
	
	Shoggoth.prototype.closeEye = function () {
	  this.speed.x = 0;
	  this.facing = this.pos.x > players[0].pos.x ? "left" : "right";
	  this.blind = true;
	  this.sprite = this.sprites["shuttingEye_" + this.facing];
	  this.sprite.addAnimationEndCallback(function () {
	    this.sprite = this.sprites.casting;
	    this.cast();
	    this.blind = false;
	  }.bind(this));
	};
	
	Shoggoth.prototype.checkForHammer = function () {
	  movers.forEach(function (mover) {
	    if (mover.type === "hammer" &&
	        mover.pos.x >= this.pos.x &&
	        mover.pos.x <= this.pos.x + this.spriteSize &&
	        mover.pos.y >= this.pos.y &&
	        mover.pos.y <= this.pos.y + this.spriteSize &&
	        !mover.soft
	        ) {
	      mover.ricochet();
	      mover.soft = 8;
	      if (this.scared) {
	        this.die();
	      } else {
	        this.panic();
	      }
	    }
	  }.bind(this));
	};
	
	Shoggoth.prototype.checkForJumpBlock = function () {
	  metaBlocks.forEach(function(metaBlock){
	    if (metaBlock && metaBlock.types.includes("horseGate") &&
	        Util.distanceBetween(players[0].pos, metaBlock.pos) < 480) {
	        metaBlock.destroy();
	    }
	    if (metaBlock && this.pos.x < metaBlock.pos.x+this.sprite.width+2 &&
	        this.pos.x > metaBlock.pos.x-2 &&
	        this.pos.y < metaBlock.pos.y+this.sprite.height+2 &&
	        this.pos.y > metaBlock.pos.y-2
	       ) {
	          if (metaBlock.types.includes("goLeft")) {
	            this.speed.x = Math.abs(this.speed.x)*(-1);
	          }
	          if (metaBlock.types.includes("goRight")) {
	            this.speed.x = Math.abs(this.speed.x);
	          }
	          if (metaBlock.types.includes("horseGate")) {
	            this.speed.x = 0;
	            this.speed.y = 0;
	          }
	        }
	  }.bind(this));
	};
	
	Shoggoth.prototype.checkForPlayer = function () {
	  var player = players[0];
	  if (player.pos.x + player.spriteSize >= this.pos.x+16 &&
	      player.pos.x <= this.pos.x + this.spriteSize-16 &&
	      player.pos.y + player.spriteSize >= this.pos.y &&
	      player.pos.y <= this.pos.y + this.spriteSize &&
	      player.checkUnderFeet() &&
	      !this.scared &&
	      this.checkUnderFeet()
	      ) {
	    if (!Math.round(Math.random(16)))
	    player.shoggothBite(this);
	  }
	};
	
	Shoggoth.prototype.destroy = function () {
	  delete movers[this.index];
	};
	
	Shoggoth.prototype.die = function () {
	  this.sprite = this.sprites["shrivel_"+this.facing];
	  this.updateSprite = function () {};
	  this.checkForPlayer = function () {};
	  this.speed.x = 0;
	  this.sprite.addAnimationEndCallback(function () {
	    this.destroy();
	  }.bind(this));
	};
	
	Shoggoth.prototype.drawBeamToHammer = function (hammer) {
	  var ctx = Util.universals.canvasContext;
	  var view = Util.universals.view.topLeftPos;
	  ctx.strokeStyle = "white";
	  ctx.globalAlpha = 0.8;
	  ctx.lineWidth = 2;
	  ctx.beginPath();
	  ctx.moveTo(this.eyePos("standing").x-view.x, this.eyePos("standing").y-view.y);
	  ctx.lineTo(hammer.pos.x+hammer.spriteSize/2-view.x, hammer.pos.y+hammer.spriteSize/2-view.y);
	  ctx.stroke();
	  ctx.strokeStyle = "black";
	  ctx.globalAlpha = 1;
	  ctx.lineWidth = 1;
	};
	
	Shoggoth.prototype.eyePos = function (pose) {
	  if (!pose) {
	    return {
	      x: this.facing === "left" ? this.pos.x + 7 : this.pos.x + this.spriteSize - 7,
	      y: this.pos.y + 18
	    };
	  } else if (pose === "standing") {
	    return {
	      x: this.facing === "left" ? this.pos.x + 18 : this.pos.x + this.spriteSize - 18,
	      y: this.pos.y + 16
	    };
	  }
	};
	
	Shoggoth.prototype.panic = function () {
	  this.scared = 32*5;
	  this.casting = 0;
	  this.stats.runSpeed = -6.4;
	  this.speed.x = !Math.round(Math.random()) ? this.stats.runSpeed : 0-this.stats.runSpeed;
	  // runSpeed is negative so the Shoggoth's chase logic makes it run away
	};
	
	Shoggoth.prototype.setExtraSprites = function () {
	  this.sprites.shuttingEye_left = new Sprite (72, 72, 3, [
	    "shoggoth/left/shuttingEye/0.gif",
	    "shoggoth/left/shuttingEye/1.gif",
	    "shoggoth/left/shuttingEye/2.gif",
	    "shoggoth/left/shuttingEye/3.gif",
	    ]
	  );
	  this.sprites.shuttingEye_right = new Sprite (72, 72, 3, [
	    "shoggoth/right/shuttingEye/0.gif",
	    "shoggoth/right/shuttingEye/1.gif",
	    "shoggoth/right/shuttingEye/2.gif",
	    "shoggoth/right/shuttingEye/3.gif",
	    ]
	  );
	  this.sprites.casting_left = new Sprite (72, 72, 4, [
	    "shoggoth/left/casting/0.gif",
	    "shoggoth/left/casting/1.gif",
	    "shoggoth/left/casting/2.gif",
	    "shoggoth/left/casting/3.gif",
	    "shoggoth/left/casting/4.gif",
	    "shoggoth/left/casting/5.gif",
	    "shoggoth/left/casting/6.gif",
	    "shoggoth/left/casting/7.gif",
	    "shoggoth/left/casting/8.gif",
	    "shoggoth/left/casting/9.gif"
	    ]
	  );
	  this.sprites.casting_right = new Sprite (72, 72, 4, [
	    "shoggoth/right/casting/0.gif",
	    "shoggoth/right/casting/1.gif",
	    "shoggoth/right/casting/2.gif",
	    "shoggoth/right/casting/3.gif",
	    "shoggoth/right/casting/4.gif",
	    "shoggoth/right/casting/5.gif",
	    "shoggoth/right/casting/6.gif",
	    "shoggoth/right/casting/7.gif",
	    "shoggoth/right/casting/8.gif",
	    "shoggoth/right/casting/9.gif"
	    ]
	  );
	  this.sprites.scared_right = new Sprite (72, 72, 2, [
	    "shoggoth/right/scared/0.gif",
	    "shoggoth/right/scared/1.gif",
	    "shoggoth/right/scared/2.gif",
	    "shoggoth/right/scared/3.gif",
	    "shoggoth/right/scared/4.gif",
	    "shoggoth/right/scared/5.gif",
	    ]
	  );
	  this.sprites.scared_left = new Sprite (72, 72, 2, [
	    "shoggoth/left/scared/0.gif",
	    "shoggoth/left/scared/1.gif",
	    "shoggoth/left/scared/2.gif",
	    "shoggoth/left/scared/3.gif",
	    "shoggoth/left/scared/4.gif",
	    "shoggoth/left/scared/5.gif",
	    ]
	  );
	  this.sprites.shrivel_left = new Sprite (72, 72, 5, [
	    "shoggoth/left/shrivel/0.gif",
	    "shoggoth/left/shrivel/1.gif",
	    "shoggoth/left/shrivel/2.gif",
	    "shoggoth/left/shrivel/3.gif",
	    "shoggoth/left/shrivel/4.gif",
	    "shoggoth/left/shrivel/5.gif",
	    "shoggoth/left/shrivel/6.gif",
	    "shoggoth/left/shrivel/7.gif",
	    "shoggoth/left/shrivel/8.gif",
	    ]
	  );
	  this.sprites.shrivel_right = new Sprite (72, 72, 5, [
	    "shoggoth/right/shrivel/0.gif",
	    "shoggoth/right/shrivel/1.gif",
	    "shoggoth/right/shrivel/2.gif",
	    "shoggoth/right/shrivel/3.gif",
	    "shoggoth/right/shrivel/4.gif",
	    "shoggoth/right/shrivel/5.gif",
	    "shoggoth/right/shrivel/6.gif",
	    "shoggoth/right/shrivel/7.gif",
	    "shoggoth/right/shrivel/8.gif",
	    ]
	  );
	};
	
	Shoggoth.prototype.updateSprite = function () {
	  if (this.sprite === this.sprites.shuttingEye_left ||
	      this.sprite === this.sprites.shuttingEye_right) {
	    return;
	  }
	  if (this.speed.x > 0) {
	    this.sprite = this.sprites.running_right;
	    this.facing = "right";
	  } else if (this.speed.x < 0) {
	    this.sprite = this.sprites.running_left;
	    this.facing = "left";
	  } else {
	    this.sprite = this.sprites["standing_" + this.facing];
	  }
	  if (this.casting) {
	    this.sprite = this.sprites["casting_" + this.facing];
	  }
	  if (this.scared) {
	    this.sprite = this.sprites["scared_" + this.facing];
	  }
	};
	
	Shoggoth.prototype.wander = function () {
	  if (Math.random()*256*(Math.abs(this.speed.x)+0.5) < 1) {
	    this.speed.x = this.stats.runSpeed;
	  } else if (Math.random()*128 < 2) {
	    this.speed.x = 0-this.stats.runSpeed;
	  }
	};
	
	Shoggoth.prototype.watchForHammer = function () {
	  movers.forEach(function (mover) {
	    if (mover.type === "hammer" &&
	      !this.blind &&
	      !this.casting &&
	      !this.scared &&
	      !mover.soft
	    ) {
	      if (Util.distanceBetween(this.spriteCenter(), mover.pos) < this.stats.shieldRange && !mover.soft) {
	        mover.soft = 21;
	        mover.ricochet();
	        mover.speed.x *= 0.8;
	        mover.speed.y -= 24;
	        mover.speed.y *= 1.6;
	      }
	      if (Util.distanceBetween(this.spriteCenter(), mover.pos) < this.stats.shieldRange * 1.5) {
	        this.drawBeamToHammer(mover);
	      }
	    }
	  }.bind(this));
	};
	
	module.exports = Shoggoth;


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var Sprite = __webpack_require__(3);
	var Util = __webpack_require__(6);
	var Jumpman = __webpack_require__(5);
	var blocks = __webpack_require__(7);
	var movers = __webpack_require__(10);
	var players = __webpack_require__(11);
	
	var Sparks = function (index, pos, shoggoth) {
	  this.type = "sparks";
	  this.index = index;
	  this.spriteSize = 48;
	  this.shoggoth = shoggoth;
	  this.pos = pos;
	  this.speed = {
	    x: 0,
	    y: 0
	  };
	  this.accel = {
	    x: this.shoggoth.facing === "left" ? -0.17 : 0.17,
	    y: 1
	  };
	  this.setSprites();
	  this.age = 0;
	};
	
	Sparks.prototype.landUnderFeet = Jumpman.prototype.landUnderFeet;
	Sparks.prototype.landOnGround = Jumpman.prototype.landOnGround;
	
	Sparks.prototype.checkLine = function (array) {
	  if (this.shoggoth.facing === "right") {
	    array.forEach(function (element) {
	      if (element &&
	        element.pos.x + element.spriteSize > this.shoggoth.eyePos().x &&
	        element.pos.x < this.pos.x &&
	        element.pos.y + element.spriteSize > this.shoggoth.eyePos().y &&
	        element.pos.y < this.pos.y + this.spriteSize) {
	          if (element.type === "player") {
	            element.shogBeamBite();
	          } else if (element.type === "skeleton") {
	            element.shatter();
	          } else if (element.type === "pigeon") {
	            element.transmogrify();
	          } else if (element.type === "wizard") {
	            element.die();
	          }
	        }
	      }.bind(this));
	  } else {
	    array.forEach(function (element) {
	      if (element &&
	        this.shoggoth.eyePos().x > element.pos.x &&
	        this.pos.x < element.pos.x + element.spriteSize &&
	        this.shoggoth.eyePos().y < element.pos.y + element.spriteSize &&
	        this.pos.y + this.spriteSize > element.pos.y) {
	          if (element.type === "player") {
	            element.shogBeamBite();
	          } else if (element.type === "skeleton") {
	            element.shatter();
	          } else if (element.type === "pigeon") {
	            element.transmogrify();
	          } else if (element.type === "wizard") {
	            element.die();
	          }
	        }
	      }.bind(this));
	  }
	};
	
	Sparks.prototype.act = function () {
	  if (!this.shoggoth.casting) {
	    this.destroy();
	  }
	};
	
	Sparks.prototype.destroy = function () {
	  delete movers[this.index];
	};
	
	Sparks.prototype.drawBeam = function () {
	  var ctx = Util.universals.canvasContext;
	  var view = Util.universals.view.topLeftPos;
	  ctx.strokeStyle = "white";
	  ctx.lineWidth = 3;
	  ctx.beginPath();
	  ctx.moveTo(this.shoggoth.eyePos().x-view.x, this.shoggoth.eyePos().y-view.y);
	  ctx.lineTo(this.pos.x+this.spriteSize/2-view.x, this.pos.y+this.spriteSize-view.y);
	  ctx.stroke();
	  ctx.strokeStyle = "black";
	  ctx.lineWidth = 1;
	};
	
	Sparks.prototype.move = function () {
	  this.age++;
	  this.pos.x += this.speed.x;
	  this.pos.y += this.speed.y;
	  this.speed.x += this.accel.x;
	  this.speed.y += this.accel.y;
	  this.landUnderFeet();
	  if (this.shoggoth.casting) {
	    this.drawBeam();
	    this.checkLine(movers);
	    this.checkLine(players);
	  }
	  Util.ironWalls(this);
	};
	
	Sparks.prototype.setSprites = function () {
	  this.sprite = new Sprite(this.spriteSize, this.spriteSize, 1, [
	    "beam/sparks/0.gif",
	    "beam/sparks/1.gif",
	    "beam/sparks/2.gif",
	    "beam/sparks/3.gif",
	    "beam/sparks/4.gif",
	    "beam/sparks/5.gif",
	    "beam/sparks/6.gif"
	  ]);
	};
	
	module.exports = Sparks;


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var Block = __webpack_require__(21);
	var metaBlock = __webpack_require__(35);
	var Player = __webpack_require__(2);
	var Skeleton = __webpack_require__(15);
	var Burningman = __webpack_require__(17);
	var Shoggoth = __webpack_require__(38);
	var Boneheap = __webpack_require__(16);
	var Pigeon = __webpack_require__(36);
	var Wizard = __webpack_require__(37);
	
	var Zone = function (name, blueprint, metaBlueprint) {
	  this.name = name;
	  this.blueprint = blueprint;
	  this.metaBlueprint = metaBlueprint;
	};
	
	// X Top of a platform
	// Y Middle of a platform
	
	Zone.prototype.build = function (blocks, movers, players, metaBlocks, callback) {
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
	      } else if (square === "¡") {
	        movers.push( new Burningman (movers.length, xIndex*48, yIndex*48) );
	      } else if (square === "$") {
	        movers.push( new Shoggoth (movers.length, xIndex*48, yIndex*48) );
	      } else if (square === "*") {
	        movers.push( new Pigeon (movers.length, xIndex*48, yIndex*48) );
	      } else if (square === "1") {
	        if (!players[0]) {
	          players.push( new Player (movers.length, xIndex*48, yIndex*48) );
	        } else {
	          players[0].pos = {
	            x: xIndex*48,
	            y: yIndex*48
	          };
	        }
	      }
	    });
	  });
	
	  if (this.metaBlueprint) {
	    this.metaBlueprint.forEach(function (yLine, yIndex) {
	      yLine.split("").forEach(function (square, xIndex) {
	        if (square === ">") {
	          metaBlocks.push( new metaBlock (metaBlocks.length, xIndex*48, yIndex*48, ["jumpRight"]) );
	        } else if (square === "<") {
	          metaBlocks.push( new metaBlock (metaBlocks.length, xIndex*48, yIndex*48, ["jumpLeft"]) );
	        } else if (square === "{") {
	          metaBlocks.push( new metaBlock (metaBlocks.length, xIndex*48, yIndex*48, ["switchJumpLeft"]) );
	        } else if (square === "}") {
	          metaBlocks.push( new metaBlock (metaBlocks.length, xIndex*48, yIndex*48, ["switchJumpRight"]) );
	        } else if (square === "]") {
	          metaBlocks.push( new metaBlock (metaBlocks.length, xIndex*48, yIndex*48, ["goRight"]) );
	        } else if (square === "[") {
	          metaBlocks.push( new metaBlock (metaBlocks.length, xIndex*48, yIndex*48, ["goLeft"]) );
	        } else if (square === "#") {
	          metaBlocks.push( new metaBlock (metaBlocks.length, xIndex*48, yIndex*48, ["horseGate"]) );
	        } else if (square === "^") {
	          metaBlocks.push( new metaBlock (metaBlocks.length, xIndex*48, yIndex*48, ["jumpRight", "jumpLeft"]));
	        }
	      });
	    });
	  }
	  callback();
	};
	module.exports = Zone;


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var Zone = __webpack_require__(40);
	
	var blank = new Zone ( "blank", [
	  "---------------------------------------------------------------------------",
	  "---------------------------------------------------------------------------",
	  "---------------------------------------------------------------------------",
	  "---------------------------------------------------------------------------",
	  "---------------------------------------------------------------------------",
	  "---------------------------------------------------------------------------",
	  "---------------------------------------------------------------------------",
	  "--------------------1------------------------------------------------------",
	  "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
	  "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY",
	  "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY"
	]
	);
	
	module.exports = blank;


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var Zone = __webpack_require__(40);
	
	var burningMan = new Zone ( "burningMan", [
	  "--------------------------------------------------------",
	  "-----------*--------------------------------------------",
	  "-----------FTTTTTF--------FTTTF--------FTTTTTF----------",
	  "---------------------F-------------F--------------------",
	  "---!----------------------------------------------*-----",
	  "---FTF------FF------------FTTTF-----------FF------FTF---",
	  "--------------------------------------------------------",
	  "----------------!-----1-----¡--------------!-¡----------",
	  "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
	  "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY",
	  "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY"
	],[
	  "--------------------------------------------------------",
	  "-----------------}--------{---}--------{----------------",
	  "-----------FTTTTTF--{}----FTTTF----{}--FTTTTTF----------",
	  "---------------------F-------------F--------------------",
	  "-----}-------}------------{---}-----------{-------{-----",
	  "---FTF------FF------------FTTTF-----------FF------FTF---",
	  "--------------------------------------------------------",
	  "-}----{-{}------{-------}-----{--{------}-----{-}-----{-",
	  "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
	  "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY",
	  "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY"
	]
	);
	
	module.exports = burningMan;


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var Zone = __webpack_require__(40);
	
	var buster = new Zone ("buster", [
	  "--------------------------------------------------------",
	  "---------------------H----------H-----------------------",
	  "---------F-------FTTTTF--------FTTTTF-------F-----------",
	  "--------------------------------------------------------",
	  "-!---------------------------------!--------------------",
	  "TTF--------------FTTF------------FTTF----------------TTF",
	  "--------------------------------------------------------",
	  "-$------------$H----------!--1---$-----------H----H---$-",
	  "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
	  "YYYYYYYYYYYYYYYYYYYYYYYYYY--YYYYYYYYYYYYYYYYYYYYYYYYYYYY",
	  "YYYYYYYYYYYYYYYYYYYYYYYYY----YYYYYYYYYYYYYYYYYYYYYYYYYYY"
	],[
	  "--------------------------------------------------------",
	  "---------}------------}--------{------------{-----------",
	  "]--------F-------FTTTTF--------FTTTTF-------F----------[",
	  "]------------------------------------------------------[",
	  "]-}---------------}----------------{-----------------{-[",
	  "TTF--------------FTTF------------FTTF----------------TTF",
	  "]------------------------------------------------------[",
	  "]----------->-------------<-->----------<--#-----------[",
	  "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
	  "YYYYYYYYYYYYYYYYYYYYYYYYYY--YYYYYYYYYYYYYYYYYYYYYYYYYYYY",
	  "YYYYYYYYYYYYYYYYYYYYYYYYY----YYYYYYYYYYYYYYYYYYYYYYYYYYY"
	]
	);
	
	module.exports = buster;


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var Zone = __webpack_require__(40);
	
	var shoggothBrawl = new Zone ( "shoggothBrawl", [
	  "--------------------------------------------------------",
	  "--------------------------------------------------------",
	  "---------FTTTTTTTF---F----FTTTF----F---FTTTTTTTF--------",
	  "--------------------------------------------------------",
	  "-----*--------------------------------------------------",
	  "---FTF--------------------------------------------FTF---",
	  "--------------------------------------------------------",
	  "----------------!-----1-----!---$------------!--------$-",
	  "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
	  "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY",
	  "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY"
	],[
	  "--------------------------------------------------------",
	  "--------]-¡---!-->---<>---<--->---<>---<---!--!-[-------",
	  "---------FTTTTTTTF---F----FTTTF----F---FTTTTTTTF--------",
	  "--------------------------------------------------------",
	  "----}----------------------------------------------{----",
	  "---FTF--------------------------------------------FTF---",
	  "--------------------------------------------------------",
	  "---------{------------------$--------------!-!}*------$-",
	  "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
	  "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY",
	  "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY"
	]
	);
	
	module.exports = shoggothBrawl;


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var Zone = __webpack_require__(40);
	
	var subwayPlatform = new Zone ("subwayPlatform", [
	  "--------------------------------------------------------",
	  "------------*----------------------!---------*!---------",
	  "--------FTTTF----FTTTTF-------FTTTTF----FTTFTTF---------",
	  "--------------------------------------------!-----------",
	  "---------------------------------------------!----------",
	  "-----------------FF----FTF-----------------FTF----F-----",
	  "--------------------------------------------------------",
	  "--------------------------------!---------------------!-",
	  "XXXXXXXXXXXXXXXXXXXXXXXXXTTTTXXXXXXXXXXXXXXXXXXXXXXXXXXX",
	  "YYYYYYYYYYYYYYYYYYYYYYYYY----YYYYYYYYYYYYYYYYYYYYYYYYYYY",
	  "YYYYYYYYYYYYYYYYYYYYYYYYY----YYYYYYYYYYYYYYYYYYYYYYYYYYY"
	],[
	  "--------------------------------------------------------",
	  "------------}----{-----------<----#}----{{--------------",
	  "--------FTTTF----FTTTTF-------FTTTTF----FTTFTTF---------",
	  "--------------------------------------------------------",
	  "]----------------{}-----{>-----------------#{}----------[",
	  "]----------------FF----FTF-----------------FTF----F----[",
	  "]------------------------------------------------------[",
	  "]------------}------}--->---<-#--------->------<-------[",
	  "XXXXXXXXXXXXXXXXXXXXXXX<<TTTT>>XXXXXXXXXXXXXXXXXXXXXXXXX",
	  "YYYYYYYYYYYYYYYYYYYYYY<<<---->>>YYYYYYYYYYYYYYYYYYYYYYYY",
	  "YYYYYYYYYYYYYYYYYYYYYYYYY----YYYYYYYYYYYYYYYYYYYYYYYYYYY"
	]
	);
	
	module.exports = subwayPlatform;


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var Zone = __webpack_require__(40);
	
	
	var tooManyCooks = new Zone ("tooManyCooks", [
	  "--------------------------------------------------------",
	  "---------*-------*--------------------------*-----------",
	  "---------F-------FTTTTF--------FTTTTF-------F-----------",
	  "--------------------------------------------------------",
	  "-**--------------***----------------------------------*-",
	  "TTF--------------FTTF------------FTTF----------------TTF",
	  "--------------------------------------------------------",
	  "--------------H--------1--------------------------------",
	  "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
	  "YYYYYYYYYYYYYYYYYYYYYYYYYY--YYYYYYYYYYYYYYYYYYYYYYYYYYYY",
	  "YYYYYYYYYYYYYYYYYYYYYYYYY----YYYYYYYYYYYYYYYYYYYYYYYYYYY"
	],[
	  "--------------------------------------------------------",
	  "---------}------------}--------{------------{-----------",
	  "]--------F-------FTTTTF--------FTTTTF-------F----------[",
	  "]------------------------------------------------------[",
	  "]-}---------------}----------------{-----------------{-[",
	  "TTF--------------FTTF------------FTTF----------------TTF",
	  "]------------------------------------------------------[",
	  "]----------->-------------<-->----------<--------------[",
	  "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
	  "YYYYYYYYYYYYYYYYYYYYYYYYYY--YYYYYYYYYYYYYYYYYYYYYYYYYYYY",
	  "YYYYYYYYYYYYYYYYYYYYYYYYY----YYYYYYYYYYYYYYYYYYYYYYYYYYY"
	]
	);
	
	module.exports = tooManyCooks;


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var Zone = __webpack_require__(40);
	
	var zoneOne = new Zone ("zoneOne", [
	  "------XXXXXXXXXXXXXXXXXXXXX----XXXXXXXX----XXXXXXXXXXXXX",
	  "XX------------------------------------------------------",
	  "--------------------------------------------------------",
	  "--------------------------------------------------------",
	  "-----XX-------------------------------------------------",
	  "--------------------------------------------------------",
	  "--------------------------XX----------------------------",
	  "XX----------XX----XXXXXX------X-------------------------",
	  "-----XXXX-----------------XX------XXX-------------------",
	  "---------------------------------------XX----XXX-X------",
	  "-----------------------------------------------------XXX",
	  "--------------------------------------------------------",
	  "--------------------------------------------------------",
	  "------------------------XXX--------------------XXXX-----",
	  "-XXXXXXXXXXXX--XXXXXXX--------XXXXX---X---XXX-----------"
	]);
	
	module.exports = zoneOne;


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var Zone = __webpack_require__(40);
	
	var junction = new Zone ( "Broadway Junction", [
	  "-------------------------------------------------------------------",
	  "----------------------1--------------------------------------------",
	  "---------FTTTTTTTF---F----FTTTF------FTTTF----F---FTTTTTTTF--------",
	  "-------------------------------------------------------------------",
	  "-----*-------------------------------------------------------------",
	  "---FTF-------------------------------------------------------FTF---",
	  "-------------------------------------------------------------------",
	  "----------------!--------------------$--!---------------!--------$-",
	  "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
	  "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY",
	  "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY"
	],[
	  "-------------------------------------------------------------------",
	  "--------]-¡---!-->---<>--------------<--->---<>---<---!--!-[-------",
	  "---------FTTTTTTTF---F----FTTTF------FTTTF----F---FTTTTTTTF--------",
	  "-------------------------------------------------------------------",
	  "----}---------------------------------------------------------{----",
	  "---FTF-------------------------------------------------------FTF---",
	  "-------------------------------------------------------------------",
	  "---------{-----------------------------$--------------!-!}*------$-",
	  "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
	  "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY",
	  "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY"
	]
	);
	
	module.exports = junction;


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var Zone = __webpack_require__(40);
	
	var throop = new Zone ("Throop", [
	  "---------------------------------------------------------------------------",
	  "----------*---------------------------------------------------#!-----------",
	  "----------FTTF----------FTTF-----------------FTTTF----------FTTTF----------",
	  "---------------------------------------------------------------------------",
	  "-----------------------------------------------*-#?-----#!-----------------",
	  "-----------------FTTTF-------------------1-----FTTTTTTTTTTF----------------",
	  "---------------------------------------------------------------------------",
	  "¡#-!#-?#--!#----------------------------------------------#?--#!-----------",
	  "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
	  "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY",
	  "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY"
	],[
	  "---------------------------------------------------------------------------",
	  "---------#*#--------------------------------------------------#!*----------",
	  "----------FTTF-----------FTF-----------------FTTTF-----------FTTF----------",
	  "---------------------------------------------------------------------------",
	  "---------------{----}*--------------------------{#!{----#!}----------------",
	  "-----------------FTTTF----1--------------------FTTTTTTTTTTF----------------",
	  "---------------------------------------------------------------------------",
	  "-!#-!#--!#---}--}----{--{-------------------}--}-------{----{#!-------#!---",
	  "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
	  "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY",
	  "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY"
	]
	);
	
	throop.trainY = 8*48;
	module.exports = throop;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map
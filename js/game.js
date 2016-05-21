Window.newGame = function () {
  var renderZone = require('./renderZone.js');
  var Player = require('./objects/player.js');
  var Skeleton = require('./objects/skeleton.js');
  var Block = require('./objects/block.js');
  var Util = require('./util/util.js');
  var View = require('./objects/view.js');
  var keyEvents = require('./keyEvents.js');
  var blocks = require('./objectArrays/blocks.js');
  var aiHints = require('./objectArrays/metaBlocks.js');
  var tiles = require('./objectArrays/tiles.js');
  var overlays = require('./objectArrays/overlays.js');
  var movers = require('./objectArrays/movers.js');
  var trains = require('./objectArrays/trains.js');
  var players = require('./objectArrays/players.js');
  var Conductor = require('./objects/trains/conductor.js');

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

  Game.buildZone = function () {
    var zone = require('./zones/throop.js');
    this.zone = zone;

    var callback = function () {
      this.setupKeyControls();
    }.bind(this);

    this.zone.build(this.blocks, this.movers, this.players, this.metaBlocks, callback);

    var backgroundBricks = require('./backgrounds/junctionBricks.js');
    backgroundBricks.build(tiles);

    var backgroundPillars = require('./backgrounds/junctionLamps.js');
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

  Game.playGame = function () {
    setInterval(function () {
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
  };

  Game.startUpCanvas();
  Game.buildZone();
  Game.setView();
  Game.playGame();
};

Window.newGame();

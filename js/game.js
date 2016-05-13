var renderZone = require('./renderZone.js');
var Player = require('./objects/player.js');
var Skeleton = require('./objects/skeleton.js');
var Block = require('./objects/block.js');
var View = require('./objects/view.js');
var keyEvents = require('./keyEvents.js');
var blocks = require('./objectArrays/blocks.js');
var metaBlocks = require('./objectArrays/metaBlocks.js');
var tiles = require('./objectArrays/tiles.js');
var movers = require('./objectArrays/movers.js');
var players = require('./objectArrays/players.js');

window.onload = function () {
  var canvas = document.getElementById("canvas");

var ctx = canvas.getContext('2d');
ctx.clearRect(0, 0, canvas.width, canvas.height);

players.push( new Player (8*48, 5*48) );
keyEvents(document, players[0]);

var zone = require('./zones/subwayPlatform.js');
zone.build(blocks, movers, metaBlocks);

var backgroundBricks = require('./backgrounds/subwayPlatformBricks.js');
backgroundBricks.build(tiles);

var backgroundPillars = require('./backgrounds/subwayPlatformPillars.js');
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

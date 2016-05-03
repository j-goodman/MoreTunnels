var renderZone = require('./renderZone.js');
var Player = require('./objects/player.js');
var Block = require('./objects/block.js');
var View = require('./objects/view.js');
var keyEvents = require('./keyEvents.js');
var blocks = require('./objectArrays/blocks.js');
var tiles = require('./objectArrays/tiles.js');

window.onload = function () {
  var canvas = document.getElementById("canvas");

var ctx = canvas.getContext('2d');
ctx.clearRect(0, 0, canvas.width, canvas.height);

var player = new Player (8*48, 5*48);
keyEvents(document, player);

var zone = require('./zones/subwayPlatform.js');
zone.build(blocks);

var background = require('./backgrounds/subwayPlatform.js');
background.build(tiles);

var view = new View (0, 0, 640, 480, 55*48, 10*48);

  setInterval(function () {
    ctx.fillStyle = "turquoise";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    blocks.forEach(function(block){
      block.sprite.draw(ctx, block.pos, view.topLeftPos);
    });

    tiles.forEach(function(tile){
      tile.sprite.draw(ctx, tile.pos, view.topLeftPos);
    });
    
    blocks.forEach(function(block){
      block.sprite.draw(ctx, block.pos, view.topLeftPos);
    });

    view.recenter(player.pos);

    if (player.checkUnderFeet()) {
      ctx.beginPath();
      ctx.arc(80,40,8,0,2*Math.PI);
      ctx.stroke();
    }

    player.sprite.draw(ctx, player.pos, view.topLeftPos);

    player.drawData(ctx);

    player.move();
  }, 32);
};

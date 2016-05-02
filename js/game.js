var renderZone = require('./renderZone.js');
var Player = require('./objects/player.js');
var Block = require('./objects/block.js');
var View = require('./objects/view.js');
var keyEvents = require('./keyEvents.js');
var blocks = require('./objectArrays/blocks.js');

window.onload = function () {
  var canvas = document.getElementById("canvas");

var ctx = canvas.getContext('2d');
ctx.clearRect(0, 0, canvas.width, canvas.height);

var player = new Player (6*48, 8*48);
keyEvents(document, player);

var zoneOne = require('./zones/zoneOne.js');
zoneOne.build(blocks);

var view = new View (0, 0, 640, 480);

  setInterval(function () {
    ctx.fillStyle = "turquoise";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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

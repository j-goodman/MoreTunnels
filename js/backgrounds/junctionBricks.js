var Background = require("../background.js");
var Sprite = require("../sprite.js");

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
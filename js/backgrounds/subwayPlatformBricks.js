var Background = require("../background.js");
var Sprite = require("../sprite.js");

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

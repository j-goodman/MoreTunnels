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

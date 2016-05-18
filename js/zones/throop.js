var Zone = require("../zone.js");

var throop = new Zone ("Throop", [
  "---------------------------------------------------------------------------",
  "----------*---------------------------------------------------#!*----------",
  "----------FTTF----------FTTF-----------------FTTTF----------FTTTF----------",
  "---------------------------------------------------------------------------",
  "---------------------*---------------------------#!-----#!-----------------",
  "-----------------FTTTF----1--------------------FTTTTTTTTTTF----------------",
  "---------------------------------------------------------------------------",
  "-!#-!#--!#------------------------------------------------#!--#!-----------",
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

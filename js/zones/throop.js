var Zone = require("../zone.js");

var throop = new Zone ("Throop", [
  "---------------------------------------------------------------------------",
  "----------*---------------------------------------------------#L-----------",
  "----------FTTF----------FTTF-----------------FTTTF----------FTTTF----------",
  "---------------------------------------------------------------------------",
  "-----------------------------------------------*-#?-----#L-----------------",
  "-----------------FTTTF-------------------1-----FTTTTTTTTTTF----------------",
  "---------------------------------------------------------------------------",
  "M#-L#-?#--L#----------------------------------------------#?--#L-----------",
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

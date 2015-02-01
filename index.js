var EpubStream = require("./lib/core");
var eStream = new EpubStream({
    title:"Far from a maddening crowd",
    author:"Dagmara Eliemenye"
});
eStream.create(function(err, epub){
    console.log(err, epub)
});

module.exports = eStream;

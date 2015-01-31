var EpubStream = require("./lib/core");
var eStream = new EpubStream({
    title:"Far from a maddening crowd",
    author:"Larry Eliemenye"
});
eStream.create("../mybooks");

module.exports = eStream;

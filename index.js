var EpubStream = require("./lib/core");
var eStream = new EpubStream({title:"things fall apart"});
eStream.create("../mybooks");

module.exports = eStream;

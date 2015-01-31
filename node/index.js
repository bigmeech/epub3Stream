var EpubStream = require("./lib/core")

var eStream = new EpubStream();
eStream.create({title:"things fall aprt"});

module.exports = eStream;

var xml = require("xml2js");
var zip = require("adm-zip");
var fs = require("fs");
var dust = require("dustjs-linkedin");
var util = require("util");
var Stream = require("stream");
var fs = require("fs");
var uuid = require("node-uuid");

var metadataTmpl = __dirname + '/templates/metadata.xml';


/*
 * Some core stuff...making metadata n shit
 * Core should handle things like creating the epub structure
 * and creating metadata. all xml elements are taken from the templates and complied with dustjs
 */

function EpubStream(options) {
    this.options = options
}

/*
*
*
* Creates a bare bones structure of the epub package based on the meta template xml file
*
*
*
*
* */

 EpubStream.prototype.create = function (path) {

    //contain at least the title or throw an error
    if (!this.options.title) throw new Error("at least a  title is required")

    //take a metadata template XML from the templates directory and complie it with DUSTJS

    var context = {
        title:"Things fall apart",
        uid:uuid.v4(),
        lang:"en-GB"

    };
    fs.readFile(metadataTmpl, "utf8", function(err, metadata){
        dust.compileFn(metadata)(context, function(err, data){
            console.log(err, data)
        });
    });


}
module.exports = EpubStream;


var xml = require("xml2js");
var zip = require("adm-zip");
var fs = require("fs");

/*
 * Some core stuff...making metadata n shit
 * Core should handle things like creating the epub structure
 * and creating metadata. all xml elements are taken from the templates and complied with dustjs
 */

function EpubStream(options){
  this.options = options
}

EpubStream.prototype.create = function(options){

   //contain at least the title or throw an error
    if(!options.title) throw new Error ("at least a  title is required")

   //take a metadata template XML from the templates directory and complie it with DUSTJS

}
module.exports = EpubStream;

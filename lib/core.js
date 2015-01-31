var xml = require("xml2js");
var zip = require("adm-zip");
var fs = require("fs");
var dust = require("dustjs-linkedin");
var util = require("util");
var Stream = require("stream");
var fs = require("fs");
var uuid = require("node-uuid");
var mkdirp = require("mkdirp");
var async = require("async");
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

        //Minimum required attributes
        title: "Things fall apart",
        uid: this.options.isbn || uuid.v4(),
        lang: "en-GB",
        author: "cynthiaEliemenye",
        dcTermsModified: new Date()

    };
    var userDir = "./mybooks/" + context.author + "/" + context.uid;

    var readRawMetaFile = function(done){
        fs.readFile(metadataTmpl, "utf8", function(err, fileData){
            if(err) done(err);
            done(null, fileData);
        });
    };

    var compileRawMetaFile = function(file, done){
        dust.compileFn(file)(context, function(err, data){
            if(err) done(err)
            done(null, data);
        });
    };

    var createDirStructure = function(compileResult, done){
        mkdirp(userDir, function(err){
            if(err) done(err);
            done(null, compileResult);
        })
    };

    var writeFile = function(compilation, done){
        fs.writeFile(userDir + "/metadata.xml", compilation, function(err, data){
            if(err) done(err);
            done(null, "Successfuly created structure!");
        })
    };

    async.waterfall([readRawMetaFile, compileRawMetaFile, createDirStructure, writeFile], function(error, results){
        console.log(error, results)
    });
};
module.exports = EpubStream;

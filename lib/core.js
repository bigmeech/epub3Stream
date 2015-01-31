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
var _ = require("lodash");
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
    /*
     *
     * Builds context for DUSTJS to work with.
     * @Requires Options object which MUST include book title
     *
     * */
    var buildContext = function (options) {

        var ctx = {};
        var missingProperties = [];
        var defaults = {

            lang: "en-GB",
            lastModified: new Date(),
            datePublished: new Date()
        };

        //titles
        if (options.title) ctx.title = options.title;
        else missingProperties.push("title");

        //author
        if (options.author) ctx.author = options.author;
        else missingProperties.push("author");

        //identity
        if (options.isbn) ctx.indentity = "urn:isbn:" + options.isbn;
        else ctx.identity = "urn:uuid:" + uuid.v4();

        if (missingProperties.length > 0) {
            throw new Error("You are missing one of these required properties: " + missingProperties.join(", "));
        } else {
            return _.merge(defaults, ctx)
        }
    };

    var ctxObj = buildContext(this.options);
    var userDir = "./mybooks/" + ctxObj.author + "/" + ctxObj.identity.substr(ctxObj.identity.lastIndexOf(":") + 1);

    /*
    *
    * reads in dust ready template file for metadata xml
    * and passes control to a compiler function
    *
    * */
    var readRawMetaFile = function (done) {
        fs.readFile(metadataTmpl, "utf8", function (err, fileData) {
            if (err) done(err);
            done(null, fileData);
        });
    };

    /*
    *
    * Compiles raw metadata to an actual xml file using a context object. Also
    * passes control to a directory structure creator
    *
    *
    * */
    var compileRawMetaFile = function (file, done) {
        dust.compileFn(file)(ctxObj, function (err, data) {
            if (err) done(err);
            done(null, data);
        });
    };

    /*
    *
    *
    * creates directory structure skeleton for an epub file(unpacked)
    *
    *
    *
    * */
    var createDirStructure = function (compileResult, done) {
        mkdirp(userDir, function (err) {
            if (err) done(err);
            done(null, compileResult);
        });
    };

    /*
    *
    *
    * Writes the metadata.xml file to directory structure skeleton
    *
    * */
    var writeFile = function (compilation, done) {
        fs.writeFile(userDir + "/metadata.xml", compilation, function (err, data) {
            if (err) done(err);
            done(null, "Successfuly created structure!");
        });
    };

    async.waterfall([readRawMetaFile, compileRawMetaFile, createDirStructure, writeFile], function (error, results) {
        console.log(error, results)
    });
};
module.exports = EpubStream;

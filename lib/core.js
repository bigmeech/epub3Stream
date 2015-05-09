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
var metadataTmpl = __dirname + '/templates/structure/EPUB/package.opf';
var workspaceDir = process.cwd() + "/workspace/";
var publishDir = process.cwd() + "/published/";
var wrench = require("wrench");
var debug = require("debug")('EpubStream');
var Zip = require("adm-zip");
var StreamBuffers = require("stream-buffers");

//libs
var Epub = require("./publication");
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

EpubStream.prototype.create = function (callback) {
    /*
     *
     * Builds context for DUSTJS to work with.
     * @Requires Options object which MUST include book title
     *
     * */

    var self = this;
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
        if (options.isbn) ctx.identity = "urn:isbn:" + options.isbn;
        else ctx.identity = "urn:uuid:" + uuid.v4();

        if (missingProperties.length > 0) {
            throw new Error("You are missing one of these required properties: " + missingProperties.join(", "));
        } else {
            return _.merge(defaults, ctx)
        }
    };

    var ctxObj = buildContext(this.options);
    ctxObj.publicationId = ctxObj.identity.substr(ctxObj.identity.lastIndexOf(":") + 1)
    var userDir = ctxObj.author + "/" + ctxObj.publicationId;

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
            debug(': Read template package.opf');
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
            debug(': Compiled package.opf using template');
        });
    };

    /*
     *
     *
     * copies structure skeleton for an epub file(unpacked), compile necessary dust templates
     *
     * */
    var createDirStructure = function (compileResult, done) {

        wrench.mkdirSyncRecursive(workspaceDir + userDir, 0777);
        wrench.copyDirRecursive(
            __dirname + "/templates/structure",
            workspaceDir + userDir,
            {forceDelete: true},
            function (err, files) {
                if (err) done(err);
                done(null, compileResult);
                debug(': Successfully copied template directory');
            });
    };

    /*
     *
     *
     * Writes the opf file to directory structure skeleton
     *
     **/
    var writeFile = function (compilation, done) {
        fs.writeFile(workspaceDir + userDir + "/EPUB/package.opf", compilation, function (err, data) {
            if (err) done(err);
            done(null, workspaceDir + userDir);
            debug(': Successfully created Epub Project');
        });
    };

    async.waterfall([readRawMetaFile, compileRawMetaFile, createDirStructure, writeFile], function (error, finalResult) {
        if (error) callback.call(this, error, null);
        ctxObj.physical_path = finalResult;
        callback.call(this, null, ctxObj);
    });
};

/*
 *
 * validates and moves the pub to a "published" folder
 *
 * */

EpubStream.prototype.publish = function (projectDir, callback) {
    var projectExists = fs.existsSync(call)
};

/*
 *
 * Archive the project into epub file
 *
 * */

EpubStream.prototype.pack = function (context, callback) {
    var epubFile;
    var destination = publishDir + context.author + "/" + context.title + ".epub";
    var items = wrench.readdirSyncRecursive(context.physical_path);
    var mimeTypePath = context.physical_path + "/mimetype";


    //add mimetype file and zips it
    var addMimeTypeFile = function (done) {
        epubFile = new Zip();
        epubFile.addLocalFile(mimeTypePath);
        epubFile.getEntry('mimetype').method = 0;
        epubFile.getEntry('mimetype').offset = 38;
        epubFile.writeZip(destination);

        done(null, epubFile)
    };

    //reopenes the zip and added the rest of the file
    var addOtherFiles = function (epubFile, done) {
        if (fs.existsSync(destination)) {
            var epub = new Zip(destination);
            items.forEach(function (item) {
                var currentPath = workspaceDir + context.author + "/" + context.publicationId + "/" + item;
                if (item !== "mimetype") {
                    if(!fs.lstatSync(currentPath).isDirectory()){
                        epub.addLocalFile(currentPath);
                    }
                }
            });
            epub.writeZip(destination);
        }
        done(epub);
    };

    async.waterfall([addMimeTypeFile, addOtherFiles], function (err, epubFile) {
        console.log(result);
    });

    /*//add files to archive
     var addFiles = function (item) {
     var itemStat = fs.lstatSync(context.physical_path + "/" + item);
     if (itemStat.isDirectory()) {
     epubZipper.addLocalFolder(context.physical_path + "/" + item);
     }
     else {
     epubZipper.addLocalFile(context.physical_path + "/" + item);
     }
     };

     var addMimeType = function (item) {

     };


     items.forEach(addFiles);
     epubZipper.writeZip(destination);*/
    callback.apply(this, [null, destination]);
};
module.exports = EpubStream;

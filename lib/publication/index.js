var xml = require("xml2js");

var PAGE_TYPE = {
    COVER_PAGE_FRONT:"cover_front",
    ACKNOWLEDGEMENT:"acknowledgement",
    PREFACE:"preface",
    COVER_PAGE_BACK:"cover_back"
};
function Publication(path){


    /*
    *
    * */
    var getMetaData = function(){

    };

    /*
    *
    *
    * */
    var setMetaData = function(name, value){

    };

    var addPage = function(type, html_content){

    };

    console.log(path);
    return{
        getMetadata:getMetaData,
        setMetaData:setMetaData,
        addPage:addPage
    }
}

module.exports = Publication;
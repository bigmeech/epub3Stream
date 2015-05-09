var EpubStream = require("./lib/core");
var eStream = new EpubStream({
    title:"Eze goes to school",
    author:"Chuma Ekebe"
});
eStream.create(function(err, ctx){
    eStream.pack(ctx, function(err, epub){
        if(err) throw err;
        console.log(err, epub);
    });
});



module.exports = eStream;

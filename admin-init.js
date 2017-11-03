module.exports = function (models, encryptor) {
    //admin stuff

    models.Admin.create({firstname: "admin", lastname:"admin", email: "admin@admin.com", password: encryptor.encryptPass("admin")}, function(err, obj) {
        if(!err) {
            console.log("admin created");
        }
    });
    
    models.Conference.create({name: "AdminConf", startDate: new Date(), endDate: new Date(), reviewForm: {}}, function(err, obj) {
        if(!err) {
            console.log("AdminConf created");
        }
    });
    
    models.Track.create({name: "AdminTrack"}, function(err, obj) {
        var trackObj = obj;
        
        if(!err) {
            models.Conference.findOne({name: "AdminConf"}, function (err, obj) {
                if (!err) {
                    var confId = obj.id;
                    console.log(confId);
                    trackObj.set({cid: confId});
                    trackObj.save(function(err){
                       if(!err) {
                           console.log("AdminTrack saved");
                       } 
                    });
                    
                    models.Privilege.create({email: "admin@admin.com", tid: trackObj.id, cid: confId}, function(err, obj){
                       if(!err) {
                           console.log("Admin privileges assigned")
                       } 
                    });
                }
            })
        }
    });    
}

module.exports = function (models) {
    return {
        getTrackView: function() {
            return function(req, res) {
                models.Track.findById(req.params.trackid, function (err, track) {
                    if(!err && track) {
                        if(req.session.privilege == "admin") {
                            res.render("track/index", {track: track, privilege: "admin"})
                        }
                        else {
                            models.Privilege.findOne({userid: req.session.userid, cid: track.cid}, function(err, privilege){
                                if(!err && privilege) {
                                     res.render("track/index", {track: track, privilege: privilege.privilege});
                                }
                                else if(! privilege) {
                                    res.render("track/index", {track: track, privilege:"Ordinary"});
                                }
                                else {
                                    //an error happened. probably flash something
                                    res.render("track/index", {conference: track, privilege:""});
                                }
                            });      
                        }
                          
                    }
                    
                
                })
            }
        },
        createTrack: function() {
            
            return function (req, res) {
                var trackName     = req.body.name;
                var conferenceId  = req.params.id;
                
                models.Track.create({name: trackName, cid: conferenceId}, function (err, track) {
                    if (track && !err) {
                        res.json({
                            status: "ok"
                        });
                    }
                });
                
            }
        },
        saveTrack: function() {
            
            return function(req, res) {
               var trackId      = req.params.trackid;
            
                models.Track.findById(trackId, function(err, track) {
                    track.set('name', req.body.name);
                    track.save(function(err, savedTrack) {
                        if(!err && savedTrack) {
                            res.json({status: "ok"});
                        }
                        else {
                            //do something
                        }
                    });
                }); 
            }
            
        },
        getEditView: function() {
            return function(req, res) {
                models.Track.findById(req.params.trackid, function (err, track) {
                    if(!err && track) {
                        if(req.session.privilege == "admin") {
                            res.render("edit/track", {track: track, privilege: "admin"})
                        }
                        else {
                            models.Privilege.findOne({userid: req.session.userid, cid: track.cid}, function(err, privilege){
                                if(!err && privilege) {
                                     res.render("edit/track", {track: track, privilege: privilege.privilege});
                                }
                                else if(! privilege) {
                                    res.render("edit/track", {track: track, privilege:"Ordinary"});
                                }
                                else {
                                    //an error happened. probably flash something
                                    res.render("edit/track", {conference: track, privilege:""});
                                }
                            });    
                        }
                            
                    }
                    
                
                })
            }
        }
    }
}

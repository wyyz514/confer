var express = require("express");
var router  = express.Router();

module.exports = function (models) {
    var track      = require("../middlewares/track")(models);
    var conference = require("../middlewares/conference")(models);
    
    router.get("/:id", function (req, res, next) {
        if (req.session.isLoggedIn) {
            next();
        } else {
            res.redirect('/auth/login');
        }
    },conference.getConferenceView());
    
    //show conference edit page
    router.get("/:id/edit", conference.getEditView());
    
    router.post("/:id/edit", conference.saveConference());
    
    router.post('/:id/tracks/', track.createTrack());
    
    //edit an existing track
    router.post("/:id/tracks/:trackid/edit", track.saveTrack());
    
    //show track edit page
    router.get("/:id/tracks/:trackid/edit", track.getEditView());
    
    router.get("/:id/tracks/:trackid", track.getTrackView());
    
    router.post("/:id/tracks/:trackid/trackassign/:userid", function (req, res) {
        
        models.Track.findById(req.params.trackid, function (err, track) {
            var previousTrackChairId = track.trackChairId;
            var trackChairId         = req.params.userid;
            var trackId              = req.params.trackid;
            
            track.set('trackChairId', trackChairId); 
            
            if(previousTrackChairId) {
                //create new privilege entry for the newly assigned chair and remove the previous chair's privilege
                models.Privilege.create({userid: trackChairId, cid: req.params.id, tid: trackId, privilege: "Track Chair"}, function(err, savedPrivilege) {
                   if (!err && savedPrivilege) {
                       models.Privilege.remove({userid: previousTrackChairId}, function(err) {
                           if(!err) {
                                track.save(function(err, saved) {
                                   if (!err && saved) {
                                       res.json({
                                          "status": "ok",
                                          "trackChairId": trackChairId
                                       });
                                   } 
                                });
                           }
                       });
                    }
                });    
            }
            else {
                track.save(function(err,savedConference) {
                   if(!err && savedConference) {
                       res.json({
                           'status': "ok",
                           'trackChairId': trackChairId
                       });
                   }
               });    
            }
            
        });
    });
    return router;
}
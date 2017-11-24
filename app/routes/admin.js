var express          = require("express");
var router           = express.Router();
var encryptor        = require("../helpers/encryptor");

module.exports = function(models) {
    
    var logoutMiddleware = require("../middlewares/auth")(models).logout;
    
    router.get("/", function (req, res, next){
        //if admin already logged in, then display dashboard
        if (req.session.isLoggedIn && req.session.privilege === "admin") {
            res.render("admin/index");
        } else {
            //whoever is trying to access is either not admin or not a logged in admin
            res.locals.type    = "danger";
            res.locals.message = "Invalid privilege level";
            res.render("auth/login");
        }
    });
    
    //show admin's login page
    router.get("/login", function (req, res) {
       res.render("admin/login"); 
    });
    
    //validate admin attempt to login
    router.post("/login", function (req, res) {
       var email    = req.body.email;
       var password = req.body.password;
       
       models.Admin.findOne({email: email}, function(err, user) {
           if (!err && user) {
               var isCorrectPassword = encryptor.compare(password, user.password);
               
               if(isCorrectPassword) {
                   res.setHeader('Content-Type', 'application/json');
                   req.session.privilege  = "admin";
                   req.session.isLoggedIn = "true";
                   req.session.authenticatedEmail = email;
                   res.json({
                       "status": 200,
                       "target": "/admin/"
                   });
               }
               else {
                   res.setHeader('Content-Type', 'application/json');
                   res.json({
                        "status": 500
                   });
               }
           }
           else {
               //there is an error from mongoose
               res.json({
                  "status": 500 
               });
           }
       });
    });    
    
    router.get("/logout", logoutMiddleware());
    
    //when a user id is clicked, display the user edit page
    router.get("/users/:id/edit", function(req, res) {
        var userId = req.params.id;
        models.User.findById(userId, function(err, user){
           if(!err) {
               res.render("edit/user", {user: user});
           } 
        });
        
    });
    
    //same thing as above but for conferences
    router.get("/conferences/:id/edit", function(req, res) {
        var conferenceId = req.params.id;
        models.Conference.findById(conferenceId, function(err, conference){
           if(!err) {
               res.render("edit/conference", {conference: conference});
           } 
        });
        
    });
    
    //post route for saving the updated user
    router.post("/users/:id/edit", function(req, res) {
        var userId = req.params.id;
        models.User.findById(userId, function(err, user) {
           user.set('firstname', req.body.firstname);
           user.set('lastname', req.body.lastname);
           user.set('email', req.body.email);
           user.save(function(err,savedUser) {
               if(!err && savedUser) {
                   res.json({
                       'status': "ok",
                       'target': "/admin"
                   })
               }
           });
        });
    });
    
    //same as above but for conferences
    router.post("/conferences/:id/edit", function(req, res) {
        var conferenceId = req.params.id;
        
        models.Conference.findById(conferenceId, function(err, conference) {
           conference.set('name', req.body.name);
           conference.set('startDate', req.body.startDate);
           conference.set('endDate', req.body.endDate);
           conference.save(function(err,savedConference) {
               if(!err && savedConference) {
                   res.json({
                       'status': "ok",
                       'target': "/admin"
                   })
               }
           });
        });
        
    });
    
    //tpc chair assignment
    router.post("/conferences/:id/assigntpc/:userid", function(req, res) {
        var conferenceId = req.params.id;
        var tpcChairId   = req.params.userid;
        
        models.Conference.findById(conferenceId, function(err, conference) {
           var previousTPCChairId = conference.tpcChairId;
           conference.set('tpcChairId', tpcChairId);
           
           if (previousTPCChairId) {
                models.Privilege.create({userid: tpcChairId, cid: conferenceId, tid: "0", privilege: "TPC Chair"}, function(err, savedPrivilege) {
                   if (!err && savedPrivilege) {
                       models.Privilege.remove({userid: previousTPCChairId}, function(err) {
                           if(!err) {
                               conference.save(function(err, saved) {
                                   if(!err && saved) {
                                       res.json({status: "ok", tpcChairId: tpcChairId});
                                   }
                               });
                           }
                       });
                    }
                });    
           }
           else {
                conference.save(function(err,savedConference) {
                   if(!err && savedConference) {
                       res.json({
                           'status': "ok",
                           'tpcChairId': tpcChairId
                       });
                   }
               });   
           }
        
           
        });
    });
    
    //create a new track
    router.post('/conferences/:id/tracks/', function (req, res) {
        var trackName     = req.body.name;
        var conferenceId  = req.params.id;
        
        models.Track.create({name: trackName, cid: conferenceId}, function (err, track) {
            if (track && !err) {
                res.json({
                    status: "ok"
                });
            }
        });
        
    });
    
    //edit an existing track
    router.post("/conferences/:id/tracks/:trackid/edit", function(req, res) {
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
        
    });
    
    //show track edit page
    router.get("/conferences/:id/tracks/:trackid/edit", function(req, res) {
        models.Track.findById(req.params.trackid, function(err, track) {
            if (!err && track) {
                res.render("edit/track", {track: track});    
            } else {
                //do something
            }
        })
        
    });
    
    //assign track chair
    router.post("/conferences/:id/tracks/:trackid/trackassign/:userid", function (req, res) {
        
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
};

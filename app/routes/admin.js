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
           conference.set('name', req.query.name);
           conference.set('startDate', req.query.startDate);
           conference.set('endDate', req.query.endDate);
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
    
    return router;
};

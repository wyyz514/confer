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
            res.locals.type    = "danger";
            res.locals.message = "Invalid privilege level";
            res.render("auth/login");
        }
    });

    router.get("/login", function (req, res) {
       res.render("admin/login"); 
    });

    router.post("/login", function (req, res) {
       var email    = req.body.email;
       var password = req.body.password;
       
       console.log(req.body);
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
    
    return router;
};

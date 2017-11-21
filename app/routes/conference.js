var express = require("express");
var router  = express.Router();

module.exports = function (models) {
    
    router.get("/:id", function (req, res, next) {
        if (req.session.isLoggedIn) {
            next();
        } else {
            res.redirect('/auth/login');
        }
    }, function (req, res) {
        var conferenceId = req.params.id;
        models.Conference.findById(conferenceId, function (err, conference) {
            if (!err && conference) {
                res.render("conference/index", {conference: conference});
            }
            else {
                //show some error
            }
        })
    });
    return router;
}
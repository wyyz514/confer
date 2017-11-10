var express = require('express');
var router  = express.Router();


module.exports = function(models) {
    
    router.get('/users', function(req, res) {
        models.User.getDataTable(req, res); 
    });
    
    router.get('/tracks', function(req, res) {
        models.Track.getDataTable(req, res); 
    });
    
    router.get('/conferences', function(req, res) {
        models.Conference.getDataTable(req, res); 
    });
    
    return router;
}
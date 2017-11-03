var mongoose   = require('mongoose');

module.exports = function () {
    var models = {};
    
    models.User       = require('./User')(mongoose);
    models.Privilege  = require('./Privilege')(mongoose); 
    models.Conference = require('./Conference')(mongoose); 
    models.Track      = require('./Track')(mongoose);
    models.Admin      = require('./Admin')(mongoose);
    return models;
}
module.exports = function (mongoose) {
    var Conference = mongoose.model('Conference', {
        name: String,
        startDate: Date,
        endDate: Date,
        reviewForm: Object
    });
    
    Conference.getDataTable = function getData (request, response) {
        //"type.typeName" : "Trolley"
        //console.log("Get Request for Data Table made with data: ", request.query);
        Conference.dataTable(request.query, function (err, data) {
            response.send(data);
        });
    }
    return Conference;    
}

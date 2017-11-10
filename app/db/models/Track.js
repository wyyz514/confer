module.exports = function (mongoose) {
    var Track = mongoose.model('Track', {
        cid: String,
        name: String
    });
    
    Track.getDataTable = function getData (request, response) {
        
        Track.dataTable(request.query, function (err, data) {
            response.send(data);
        });
    }
    return Track;    
}
